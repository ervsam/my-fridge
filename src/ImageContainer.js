import React, { useState, useEffect } from "react";
import { Grid, Card, CardMedia, Button } from "@mui/material";
import { Box } from "@mui/system";

function ImageContainer() {
  const [images, setImages] = useState([]);
  const [fridgeOpen, setFridgeOpen] = useState(false);

  const handleImageUpload = (event) => {
    const newImage = event.target.files[0];
    setImages([...images, newImage]);
  };

  // useEffect(() => {
  //   const storedImages = localStorage.getItem("images");
  //   if (storedImages) {
  //     setImages(JSON.parse(storedImages));
  //   }
  // }, []);

  // const handleImageUpload = (event) => {
  //   const newImage = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(newImage);
  //   reader.onload = () => {
  //     const imageDataUrl = reader.result;

  //     localStorage.setItem("images", JSON.stringify([...images, imageDataUrl]));
  //     setImages([...images, imageDataUrl]);
  //   };
  // };

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
                    image={URL.createObjectURL(image)}
                    // image={image}
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
