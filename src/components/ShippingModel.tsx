// shippingModel.tsx
import React from 'react';

const ShippingModel: React.FC = () => {
  return (
    <div className="shipping-model-container" style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Modèle d'Adresse d'Expédition</h2>
      
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
        Ce modèle vous montre comment structurer correctement vos adresses d'expédition pour vos colis. Veuillez suivre ces étapes :
        <br />
        <strong>1</strong>. Assurez-vous d'inclure votre <strong>nom et le code unique PQ-067054</strong>, car ce code est extrêmement important pour identifier et traiter votre colis correctement. Sans ce code, votre colis pourrait être <strong>retardé ou perdu.</strong> 
        <br />
        <strong>2</strong>. Copiez ce format exact dans votre formulaire d'expédition ou sur votre étiquette, en remplaçant les informations par les vôtres.
        <br />
        <strong>3</strong>.<strong>Vous devez envoyer votre colis à l'adresse indiquée dans ce modèle | 8298 Northwest 68th Street Miami Fl, 33166</strong>
      </p>

      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
        <h3 style={{ marginTop: '0', color: '#444' }}>Adresse d'Expédition (Modèle)</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Votre Nom *</label>
          <input
            type="text"
            value="Votre Nom"
            readOnly
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Votre Prénom *</label>
          <input
            type="text"
            value="Votre Prénom + PQ-067054"
            readOnly
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#e6f3ff' }} // Highlight pour montrer l'importance
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Adresse *</label>
          <input
            type="text"
            value="8298 Northwest 68th Street"
            readOnly
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Appartement, Suite, etc. (optionnel)</label>
          <input
            type="text"
            value="PQ-067054"
            readOnly
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#e6f3ff' }} // Highlight pour montrer l'importance
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Ville *</label>
          <input
            type="text"
            value="Miami"
            readOnly
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>État *</label>
          <input
            type="text"
            value="Florida"
            readOnly
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Code Postal *</label>
          <input
            type="text"
            value="33166"
            readOnly
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        
      </div>

      <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
        <strong>Remarque importante :</strong> Le code <code>PQ-067054</code> doit apparaître dans votre nom ou dans l'adresse optionnelle pour garantir le traitement de votre colis. Si vous avez des questions, contactez notre service client.
      </p>
    </div>
  );
};

export default ShippingModel;