import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';

const About: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="about-page">
          <div className="product-info">
            <h2 className="product-name">Greenery</h2>
            <p className="product-description">Greenery is a mobile application designed to help plant enthusiasts identify and learn about various plant species. Whether you're a seasoned botanist or just starting your journey into the world of plants, Greenery provides a user-friendly and informative experience.</p>
          </div>

          <div className="feature-info">
            <h3 className="feature-title">Key Features:</h3>
            <ul className="feature-list">
              <li>
                <strong>Plant Identification:</strong> Capture or upload a photo of a plant, and Greenery's advanced image recognition technology will quickly identify the plant species for you. Learn interesting facts about the plant and its characteristics.
              </li>
              <li>
                <strong>Plant Library:</strong> Explore a comprehensive library of plant species, complete with detailed information, including common names, scientific names, the amount of water needed, and its livelihood. Discover new plants and expand your knowledge.
              </li>
              <li>
                <strong>Personal Collection:</strong> Create and manage your own plant collection within the app. Keep track of the plants you've identified, save favorites, and add notes or photos to create a personalized plant journal.
              </li>
            </ul>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default About;
