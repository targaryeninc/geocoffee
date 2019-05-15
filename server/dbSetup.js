/*  DROP and create User Table  */

module.exports = {
  rebuildDbStatment: `
  DROP TYPE IF EXISTS usertype CASCADE;
  CREATE TYPE usertype AS ENUM ('Business', 'Consumer');


  CREATE OR REPLACE FUNCTION f_random_text(length integer)
    RETURNS text
    LANGUAGE 'sql'
    COST 100
    VOLATILE 
  AS $BODY$
  WITH chars AS (
    SELECT unnest(string_to_array('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9', ' ')) AS _char
  ),
  charlist AS
  (
    SELECT _char FROM chars ORDER BY random() LIMIT $1
  )
  SELECT string_agg(_char, '')
  FROM charlist
  ;
  $BODY$;

  DROP TABLE  IF EXISTS  users CASCADE;
  CREATE TABLE users
  (
    user_id SERIAL PRIMARY KEY,
    user_type usertype NOT NULL DEFAULT 'Consumer',
    user_login VARCHAR(20) NOT NULL DEFAULT f_random_text(15),
    user_password  VARCHAR(20) NOT NULL DEFAULT f_random_text(15), 
    user_createdat TIMESTAMP  DEFAULT now(),
    user_fn VARCHAR(50),
    user_ln VARCHAR(50)
  )
  ;
  CREATE UNIQUE INDEX idx_userLogin ON users (user_login)
  ;
  
  DROP TABLE  IF EXISTS locations CASCADE
  ; 
  CREATE TABLE IF NOT EXISTS locations (
    LOC_id SERIAL PRIMARY KEY, 
    LOC_businessId INTEGER REFERENCES  users(USER_id) ON DELETE CASCADE, 
    LOC_name VARCHAR(250) ,
    LOC_description VARCHAR(250) , 
    LOC_address VARCHAR(250),
    LOC_city VARCHAR(30) , 
    LOC_state CHAR(2) , 
    LOC_zip VARCHAR (9),
    LOC_Phone1 VARCHAR(15),
    LOC_long FLOAT,
    LOC_lat FLOAT,
    loc_5cnt INTEGER DEFAULT 0 ,
    loc_4cnt INTEGER DEFAULT 0 ,
    loc_3cnt INTEGER DEFAULT 0 ,
    loc_2cnt INTEGER DEFAULT 0 ,
    loc_1cnt INTEGER DEFAULT 0 ,
    loc_ratingCount INTEGER DEFAULT 0 ,
    loc_ratingAvg NUMERIC(10,2) DEFAULT 0 ,
    LOC_createdAt TIMESTAMP DEFAULT NOW()
  )
  ;

  DROP TABLE IF EXISTS locationRatings  CASCADE
  ;
  CREATE TABLE IF NOT EXISTS locationRatings (
    LRA_id SERIAL PRIMARY KEY,
    LRA_locationId INTEGER REFERENCES locations(LOC_id) ON DELETE CASCADE,
    LRA_userId INTEGER REFERENCES users(USER_id) ON DELETE CASCADE,
    LRA_rating SMALLINT NOT NULL CHECK(LRA_rating BETWEEN 0 AND 5),
    LRA_createdAt TIMESTAMP DEFAULT NOW()
  );

  CREATE UNIQUE INDEX ratings_UserLocation ON locationratings(lra_locationid,lra_userid)
  ; 

 
    CREATE OR REPLACE FUNCTION public.f_updatelocationrating(
      plocationid integer,
      paddtocount integer,
      poldrating integer,
      pnewrating integer)
        RETURNS integer
        LANGUAGE 'plpgsql'
    
        COST 100
        VOLATILE 
    AS $BODY$
    DECLARE _starsToAdd INTEGER ; 
    BEGIN 
      _starsToAdd := (pNewRating -  pOldRating ) ; 
       RAISE INFO '_starsToAdd:%  pAddToCount:%',_starsToAdd,pAddToCount;
      UPDATE locations SET 
        loc_ratingCount = (loc_ratingCount+pAddToCount), 
        loc_5cnt = CASE WHEN pNewRating = 5 THEN loc_5cnt + 1 WHEN pOldRating = 5 THEN loc_5cnt - 1  ELSE loc_5cnt END , 
        loc_4cnt = CASE WHEN pNewRating = 4 THEN loc_4cnt + 1 WHEN pOldRating = 4 THEN loc_4cnt - 1  ELSE loc_4cnt END , 
        loc_3cnt = CASE WHEN pNewRating = 3 THEN loc_3cnt + 1 WHEN pOldRating = 3 THEN loc_3cnt - 1  ELSE loc_3cnt END , 
        loc_2cnt = CASE WHEN pNewRating = 2 THEN loc_2cnt + 1 WHEN pOldRating = 2 THEN loc_2cnt - 1  ELSE loc_2cnt END , 
        loc_1cnt = CASE WHEN pNewRating = 1 THEN loc_1cnt + 1 WHEN pOldRating = 1 THEN loc_1cnt - 1  ELSE loc_1cnt END , 
        loc_ratingavg = 
          CASE WHEN (loc_ratingCount+pAddToCount) = 0 
          THEN 0  -- avoid division by Zero error 
          ELSE ROUND(
              (((loc_5cnt*5)+(loc_4cnt*4)+(loc_3cnt*3)+(loc_2cnt*2)+(loc_1cnt*1)+_starsToAdd )::DECIMAL / (loc_ratingCount+pAddToCount))::NUMERIC(10,2)
          ,2) END 
      WHERE loc_id = pLocationId ;
      RETURN 1 ; 
    END  $BODY$;

    
CREATE OR REPLACE FUNCTION public.ratingchange()
RETURNS trigger
LANGUAGE 'plpgsql'
COST 100
VOLATILE NOT LEAKPROOF 
AS $BODY$
BEGIN
  IF TG_OP = 'INSERT'   THEN
PERFORM f_updateLocationRating(NEW.lra_locationId,1,0,NEW.lra_rating);
RETURN NEW; 
ELSIF TG_OP = 'UPDATE' THEN
   PERFORM f_updateLocationRating(NEW.lra_locationId,0,OLD.lra_rating,NEW.lra_rating);
RETURN NEW; 
ELSIF TG_OP = 'DELETE' THEN
  PERFORM f_updateLocationRating(NEW.lra_locationId,-1,OLD.lra_rating,0);
RETURN OLD; 
END IF;
END	
$BODY$;


DROP TRIGGER IF EXISTS ratingchange ON public.locationratings;

CREATE TRIGGER ratingchange
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.locationratings
    FOR EACH ROW
    EXECUTE PROCEDURE public.ratingchange()
    ;
`,
};
