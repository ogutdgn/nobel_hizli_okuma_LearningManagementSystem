import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";

const DragDropFileUpload = ({ onDrop }) => {
  const onDropCallback = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles[0]);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: "image/*",
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 4,
        padding: 2,
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography variant="body1">Drop the files here...</Typography>
      ) : (
        <Typography variant="body1">
          Drag & drop an image here, or click to select one
        </Typography>
      )}
    </Box>
  );
};

export default DragDropFileUpload;
