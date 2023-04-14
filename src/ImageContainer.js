import React, { useState, useEffect } from "react";
import { Grid, Card, CardMedia, Button } from "@mui/material";
import { Box } from "@mui/system";
import { openDB } from "idb";

function ImageContainer() {
  const [images, setImages] = useState([]);
  const [fridgeOpen, setFridgeOpen] = useState(false);

  useEffect(() => {
    const request = indexedDB.open("fridge", 1);

    request.onerror = (event) => {
      console.error("Failed to open indexedDB:", event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      // Open a transaction to read data from the "images" object store
      const transaction = db.transaction("images", "readonly");
      const objectStore = transaction.objectStore("images");
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        // Set the images state with the data retrieved from IndexedDB
        setImages(event.target.result.map((image) => image.dataUrl));
      };
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log("createDB");
      db.createObjectStore("images", {
        keyPath: "id",
        autoIncrement: true,
      });
    };
  }, []);

  const handleImageUpload = async (event) => {
    const newImages = event.target.files;

    for (let i = 0; i < newImages.length; i++) {
      const newImage = newImages[i];
      const reader = new FileReader();
      reader.readAsDataURL(newImage);
      reader.onload = async () => {
        const imageDataUrl = reader.result;
        const db = await openDB("fridge", 1);
        await db.add("images", { dataUrl: imageDataUrl });
        const imagesFromDB = await db.getAll("images");
        setImages(imagesFromDB.map((image) => image.dataUrl));
      };
    }
  };

  const handleOpenFridge = () => {
    setFridgeOpen(true);
  };

  const handleCloseFridge = () => {
    setFridgeOpen(false);
  };

  return (
    <div
      style={{
        background: `url(${
          fridgeOpen ? "./fridge_open.jpg" : "./fridge_closed.jpg"
        }) no-repeat center center fixed`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        {fridgeOpen ? (
          <div>
            <Button
              variant="contained"
              onClick={handleCloseFridge}
              sx={{ mr: 2, mt: 2 }}
            >
              Close Fridge
            </Button>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              id="contained-button-file"
              onChange={handleImageUpload}
              multiple
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                sx={{ mr: 2, mt: 2 }}
              >
                Add Food
              </Button>
            </label>
          </div>
        ) : (
          <div
            style={{
              position: "fixed",
              top: "500px",
              left: "30px",
              right: "0",
            }}
          >
            <Button variant="contained" onClick={handleOpenFridge}>
              Open Fridge
            </Button>
          </div>
        )}

        {fridgeOpen ? (
          <Grid
            container
            spacing={2}
            sx={{
              paddingTop: "150px",
              paddingLeft: "400px",
              paddingRight: "400px",
            }}
          >
            {images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`Food ${index}`}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Box>
    </div>
  );
}

export default ImageContainer;
