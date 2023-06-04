import React, { useEffect, useState, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonButton,
} from '@ionic/react';
import { Accept, useDropzone } from 'react-dropzone';
import axios from 'axios';

import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const API_KEY = 'zzzY1UTrDWNYh9OQgiEkeRHAqOi8ylA47u4Wuq5wxu9ALdb0UN';
const API_ENDPOINT = 'https://api.plant.id/v2/identify';

const Tab1: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [identifiedPlant, setIdentifiedPlant] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraAccess, setCameraAccess] = useState<boolean>(false);
  const [showCapturedImage, setShowCapturedImage] = useState<boolean>(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*' as unknown as Accept,
    onDrop: (acceptedFiles: File[]) => {
      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...acceptedFiles]);
    },
  });

  const captureImage = () => {
    const videoElement = videoRef.current;

    if (videoElement && videoElement.srcObject) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-image.png');
            setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, file]);
            setShowCapturedImage(true);
          }
        }, 'image/png');
      }
    }
  };

  const identifyPlant = async () => {
    setLoading(true);

    const base64files = await Promise.all(
      selectedFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    const requestData = {
      api_key: API_KEY,
      images: base64files,
      modifiers: ['crops_fast', 'similar_images'],
      plant_language: 'en',
      plant_details: [
        'common_names',
        'url',
        'name_authority',
        'wiki_description',
        'taxonomy',
        'synonyms',
      ],
    };

    try {
      const response = await axios.post(API_ENDPOINT, requestData);
      setIdentifiedPlant(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFiles.length > 0) {
      identifyPlant();
    }
  }, [selectedFiles]);

  useEffect(() => {
    if (cameraAccess && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const videoElement = videoRef.current;

          if (videoElement) {
            videoElement.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }
  }, [cameraAccess]);

  const takePlantPhoto = () => {
    setShowCapturedImage(true);
    setCameraAccess(false);
    captureImage();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div className="logo-container">
              <span className="logo-text">Greenery</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="camera-container">
          {cameraAccess && !showCapturedImage && (
            <video ref={videoRef} className="camera-preview" autoPlay playsInline muted />
          )}
          {showCapturedImage && (
            <img src={URL.createObjectURL(selectedFiles[selectedFiles.length - 1])} alt="Captured" />
          )}
        </div>
        <div className="dropzone-container" {...getRootProps()}>
          <input {...getInputProps()} />
          <IonButton>Upload Photo</IonButton>
          {cameraAccess && !showCapturedImage && (
            <IonButton onClick={() => setCameraAccess(false)}>Close Camera</IonButton>
          )}
          {!cameraAccess && !showCapturedImage && (
            <IonButton onClick={() => setCameraAccess(true)}>Open Camera</IonButton>
          )}
          {cameraAccess && !showCapturedImage && (
            <IonButton onClick={captureImage}>Capture Photo</IonButton>
          )}
          {showCapturedImage && (
            <IonButton onClick={takePlantPhoto}>Take Another Photo</IonButton>
          )}
        </div>
        <IonLoading isOpen={loading} message={'Identifying plant...'} />
        {identifiedPlant?.suggestions?.length > 0 && (
          <div className="identification-result">
            <h2>Plant Identified!</h2>
            <div className="identification-details">
              <p>Common Name: {identifiedPlant.suggestions[0].plant_name}</p>
              <p>
                Scientific Name: {identifiedPlant.suggestions[0].plant_details.name_authority}
              </p>
              
              {/* Display additional plant details as needed */}
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
