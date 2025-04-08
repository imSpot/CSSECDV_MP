# CSSWENG

## How To Run On Your Local Machine (Windows)

1. Go to folder where project is located using the file explorer
2. install npm install -g nodemon, then npm install
3. Enter `cmd` on the directory
4. Enter `node app.js` or `nodemon app.js` on cmd
5. Go to your browser and search for [http://localhost:3000/](http://localhost:3000/)

## Naming Conventions

1. Files and folders that contain HTML, Handlebars (HBS), and template files should use kebab case:
   - Example: `file-name.hbs`, `page-title.html`, `product-details.html`

2. Files and folders that contain JavaScript (JS) code should use snake case:
   - Example: `file_name.js`, `data_processing.js`, `utils_functions.js`

3. Files and folders that contain SQL code should use snake case:
   - Example: `create_table.sql`, `update_data.sql`, `select_query.sql`

4. Images with extensions .png, .jpeg, and .gif should use kebab case for their file names:
   - Example: `logo.png`, `product-image.jpeg`, `background-image.gif`
     
5. Variables should use pascal case.
    - Example: `buttonName`

Following the naming conventions will lead to an efficient and fast process of development.

## Extra Notes

- Put your code in the `temp` folder if it should be separate from the parts that is actually needed to run the web app.
- Check if there are any files that already exists before making one.
