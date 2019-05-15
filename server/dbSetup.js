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
    LOC_createdAt TIMESTAMP DEFAULT NOW()
  )
  ;

  DROP TABLE IF EXISTS locationRatings  CASCADE
  ;
  CREATE TABLE IF NOT EXISTS locationRatings (
    LRA_id SERIAL PRIMARY KEY,
    LRA_locationId INTEGER REFERENCES locations(LOC_id) ON DELETE CASCADE,
    LRA_userId INTEGER REFERENCES users(USER_id) ON DELETE CASCADE,
    LRA_rating INTEGER NOT NULL CHECK(LRA_rating BETWEEN 0 AND 5),
    LRA_createdAt TIMESTAMP DEFAULT NOW()
  );

  CREATE UNIQUE INDEX ratings_UserLocation ON locationratings(lra_locationid,lra_userid)
  ; 

  CREATE OR REPLACE VIEW v_locations AS 
    select 
    loc_id,
    loc_businessid,
    loc_name,
    loc_description,
    loc_phone1,
    loc_city
    ,loc_state 
    ,loc_zip
    ,loc_long
    ,loc_lat
    ,rating.loc_ratingCount
    ,rating.loc_avgRating
    from locations
    join users on user_id = loc_businessid
    join (
      SELECT 
      lra_locationId
      ,count(*) as loc_ratingCount
      ,ROUND(AVG(lra_rating)) AS loc_avgRating
    FROM locationratings
    GROUP BY lra_locationId
    ) as rating 
    on rating.lra_locationid = loc_id 
    ; 
`,
};
