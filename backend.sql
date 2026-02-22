Create Table Users(
  idu int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  email varchar(255) NOT NULL
);

Create Table Files(
  idf int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  idu int NOT NULL,
  name varchar(255),

  FOREIGN KEY (idu) REFERENCES Users(idu) ON DELETE CASCADE
);

Create Table FileChunk(
  idfc int NOT NULL,
  idf int NOT NULL,
  data varchar(255) NOT NULL,
  hash varchar(255) NOT NULL,

  PRIMARY KEY (idfc, idf),

  FOREIGN KEY (idf) REFERENCES Files(idf) ON DELETE CASCADE
);