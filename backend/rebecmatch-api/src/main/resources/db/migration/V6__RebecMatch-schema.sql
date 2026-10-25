CREATE TABLE candidatura (
     id INT AUTO_INCREMENT PRIMARY KEY,
     voluntario_id INT NOT NULL,
     estudo_id INT NOT NULL,
     status VARCHAR(50) NOT NULL,
     data_candidatura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (voluntario_id) REFERENCES voluntario(id),
     FOREIGN KEY (estudo_id) REFERENCES estudo(id)
);