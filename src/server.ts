import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // store the list of filtered files
  let files: string[] = [];

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url } = req.query;

    if (!image_url) {
      return res.status(400).send('image_url is required.');
    }

    let content_type;

    // get file type
    let idx = image_url.lastIndexOf('.');
    let file_type = image_url.substring(idx).toLowerCase();

    if (file_type == ".jpg" || file_type == ".jpeg") {
      content_type = "image/jpg";
    } else {
      res.set('Content-Type', content_type);
      return res.status(400).send(`Unsupported file type: ${file_type}`);
    }

    let localFile = await filterImageFromURL(image_url);
    // add it to the list of filtered images
    files.push(localFile);

    return res.status(200).sendFile(localFile);
  });


  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });

  /*
  app.on('close',() => {
    deleteLocalFiles(files);
  })
  */

  process.on('SIGTERM', () => {
    console.log("Deleting tmp files: filtered images ..");
    deleteLocalFiles(files);
    console.log("Deleting tmp files: done.");
  });

})();