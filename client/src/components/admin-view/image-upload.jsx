import PropTypes from "prop-types";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (
      selectedFile &&
      ["image/png", "image/jpeg"].includes(selectedFile.type) &&
      selectedFile.size <= 5 * 1024 * 1024 // <= 5MB
    ) {
      setImageFile(selectedFile);
    } else {
      alert("Invalid file type or size. Only PNG/JPEG under 5MB is allowed.");
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (
      droppedFile &&
      ["image/png", "image/jpeg"].includes(droppedFile.type) &&
      droppedFile.size <= 5 * 1024 * 1024
    ) {
      setImageFile(droppedFile);
    } else {
      alert("Invalid file. Only PNG/JPEG under 5MB is allowed.");
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    try {
      setImageLoadingState(true);
      const data = new FormData();
      data.append("my_file", imageFile);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
        data
      );
      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      } else {
        console.error("Upload failed:", response.data);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  return (
    <div
      className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
              disabled={isEditMode} // Disable button in edit mode
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// PropTypes declaration
ProductImageUpload.propTypes = {
  imageFile: PropTypes.instanceOf(File), // File object for image
  setImageFile: PropTypes.func.isRequired, // Function to update imageFile
  imageLoadingState: PropTypes.bool.isRequired, // Loading state of the image
  uploadedImageUrl: PropTypes.string, // Uploaded image URL
  setUploadedImageUrl: PropTypes.func.isRequired, // Function to update uploaded image URL
  setImageLoadingState: PropTypes.func.isRequired, // Function to update loading state
  isEditMode: PropTypes.bool.isRequired, // Indicates if component is in edit mode
  isCustomStyling: PropTypes.bool, // Optional custom styling flag
};

// Default props for optional props
ProductImageUpload.defaultProps = {
  imageFile: null,
  uploadedImageUrl: "",
  isCustomStyling: false,
};

export default ProductImageUpload;
