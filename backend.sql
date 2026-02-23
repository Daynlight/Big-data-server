Create Table Users(
  idu SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(255) NOT NULL
);

Create Table Files(
  idf SERIAL PRIMARY KEY NOT NULL,
  idu INT NOT NULL,
  name VARCHAR(255),
  chunks int,

  FOREIGN KEY (idu) REFERENCES Users(idu) ON DELETE CASCADE
);

Create Table FileChunk(
  idfc INT NOT NULL,
  idf INT NOT NULL,
  data BYTEA NOT NULL,
  hash VARCHAR(255) NOT NULL,

  PRIMARY KEY (idfc, idf),

  FOREIGN KEY (idf) REFERENCES Files(idf) ON DELETE CASCADE
);