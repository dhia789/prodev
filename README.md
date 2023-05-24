## API Endpoints Documentation

### `GET /matieres`

Retrieves a list of matieres.

#### Response

- **Status**: 200 OK
- **Body**: An array of matieres in JSON format.

### `POST /matiere`

Creates a new matiere.

#### Request Body

- `id` (string): The ID of the matiere.
- `title` (string): The title of the matiere.
- `description` (string): The description of the matiere.

#### Response

- **Status**: 200 OK
- **Body**: The created matiere in JSON format.

### `PUT /matieres/:id`

Updates an existing matiere.

#### Path Parameters

- `id` (string): The ID of the matiere to update.

#### Request Body

- `title` (string): The updated title of the matiere.
- `description` (string): The updated description of the matiere.

#### Response

- **Status**: 200 OK
- **Body**: The updated matiere in JSON format.

### `DELETE /matieres/:id`

Deletes an existing matiere.

#### Path Parameters

- `id` (string): The ID of the matiere to delete.

#### Response

- **Status**: 200 OK
- **Body**: The deleted matiere in JSON format.

### `GET /matieres/:id`

Retrieves a specific matiere.

#### Path Parameters

- `id` (string): The ID of the matiere to retrieve.

#### Response

- **Status**: 200 OK
- **Body**: The retrieved matiere in JSON format.

### `GET /professeurs`

Retrieves a list of professeurs.

#### Response

- **Status**: 200 OK
- **Body**: An array of professeurs in JSON format.

### `DELETE /professeurs/:id`

Deletes an existing professeur.

#### Path Parameters

- `id` (string): The ID of the professeur to delete.

#### Response

- **Status**: 200 OK
- **Body**: The deleted professeur in JSON format.

### `POST /professeur`

Creates a new professeur.

#### Request Body

- `id` (string): The ID of the professeur.
- `name` (string): The name of the professeur.
- `matiere_id` (string): The ID of the matiere associated with the professeur.

#### Response

- **Status**: 200 OK
- **Body**: The created professeur in JSON format.





 
