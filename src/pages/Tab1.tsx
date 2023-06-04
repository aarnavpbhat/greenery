import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import axios from 'axios';
import { useDropzone, Accept } from 'react-dropzone';

const Tab1: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [identifiedPlant, setIdentifiedPlant] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*' as unknown as Accept,
    onDrop: (acceptedFiles: File[]) => {
      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...acceptedFiles]);
    },
  });

  const identifyPlant = async () => {
    setLoading(true); // Start loading

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

    const data = JSON.stringify({
      api_key: "zzzY1UTrDWNYh9OQgiEkeRHAqOi8ylA47u4Wuq5wxu9ALdb0UN",
      images: base64files,
      modifiers: ["crops_fast", "similar_images"],
      plant_language: "en",
      plant_details: [
        "common_names",
        "url",
        "name_authority",
        "wiki_description",
        "taxonomy",
        "synonyms"
      ],
    });

    try {
      const response = await axios.post('https://api.plant.id/v2/identify', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIdentifiedPlant(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (selectedFiles.length > 0) {
      identifyPlant();
    }
  }, [selectedFiles]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <button>Select Photo</button>
        </div>
        {loading && <p>Identifying plant...</p>}
        {identifiedPlant && identifiedPlant.suggestions && identifiedPlant.suggestions.length > 0 && (
          <div>
            <h2>Plant Identified!</h2>
            <p>Common Name: {identifiedPlant.suggestions[0].plant_name}</p>
            <p>Scientific Name: {identifiedPlant.suggestions[0].plant_details.name_authority}</p>
            {/* Display additional plant details as needed */}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
