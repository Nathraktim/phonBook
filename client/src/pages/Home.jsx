import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Contact from '../components/Contact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// require('dotenv').config();


function Home() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const contactUrl = process.env.REACT_APP_CONTACTS_PATH || process.env.LOCAL_CONTACTS_PATH;
  const contactImageUrl = process.env.REACT_APP_CONTACTS_IMAGE_PATH || process.env.REACT_APP_LOCAL_CONTACTS_IMAGE_PATH;

  const openEditForm = async (contactId) => {
    try {
        const token = localStorage.getItem('token');
        const contactResponse = await fetch(`${contactUrl}/${contactId}`, {
            method: 'GET',
            headers: {
          Authorization: `${token}`,
            },
        });

        if (!contactResponse.ok) {
            throw new Error('Failed to fetch contact');
        }
        const data = await contactResponse.json();
        const imageUrl = data.photoLink ? `${contactImageUrl}/${data.photoLink}` : null;
        setSelectedContactId(contactId);
        setNewContact({
            name: data.name,
            email: data.email,
            phone: data.phone,
            photo: imageUrl,
        });
        setIsUpdatingContact(true);
    } catch (error) {
        console.error('Error fetching contact:', error);
        alert('An error occurred while fetching contact data.');
    }
};

const cancelHandler = async() => {
  setIsUpdatingContact(false);
  setSelectedContactId(null);
  setNewContact({
      name: '',
      email: '',
      phone: '',
      photo: null,
  });
}

const closeEditForm = async (contactId) => {
  if(!isUpdatingContact){

  }
}


  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(contactUrl, {
          method: 'GET',
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(response.data.message); 
        }

        const data = await response.json();
        setContacts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Add Contact Component (inside Home)
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    photo: null,
  });

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    
    if (confirmLogout) {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      localStorage.removeItem('loglevel');
      navigate('/login');
    }
  };

  const handleInputChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setNewContact({ ...newContact, photo: e.target.files[0] });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Allow drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0]; // Get the first dropped file
    if (file.type.startsWith('image/')) {
      setNewContact({ ...newContact, photo: file });
    } else {
      alert('Please drop an image file.');
    }
  };

  const addContact = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('name', newContact.name);
      formData.append('email', newContact.email);
      formData.append('phone', newContact.phone);
      formData.append('photo', newContact.photo);

      const response = await fetch(contactUrl, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      
      if (data.message) {
        alert(data.message);
      } else {
        setContacts([...contacts, data]);
        setNewContact({ name: '', email: '', phone: '', photo: null });
        setIsCreatingContact(false);
      }
    } catch (error) {
      setError('error');
    } finally {
      setIsLoading(false);
    }
  };

  const callContact = async (phone) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
    }
    window.open(`tel:${phone}`);
  }
    catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const emailContact = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
    }
    window.open(`mailto:${email}`);
  }
    catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const updateContact = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('name', newContact.name);
        formData.append('email', newContact.email);
        formData.append('phone', newContact.phone);
        if (newContact.photo) {
            formData.append('photo', newContact.photo);
        }

        const response = await fetch(`${contactUrl}/${selectedContactId}`, {
          method: 'PUT',
          headers: {
              Authorization: `${token}`,
          },
          body: formData,
      });

        if (!response.ok) {
            throw new Error('Failed to update contact');
        }

        const data = await response.json();
        if (data.message) {
            alert(data.message);
        } else {
          setContacts((prevContacts) => 
              prevContacts.map((contact) => 
                  contact.id === data.id ? data : contact
              )
          );
          setNewContact({ name: '', email: '', phone: '', photo: null });
          setIsUpdatingContact(false);
      }
  } catch (error) {
      console.error('Error updating contact:', error);
      setError('An error occurred while updating contact.');
  } finally {
      setIsLoading(false);
  }
};


  const deleteContact = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${contactUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `${token}`,
        },
      });


      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const username = localStorage.getItem('username');
  
  const logOut = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className='bg-zinc-900 text-white p-10 shadow-md h-[100vh] overflow-scroll scrollbar-hidden'>
      <div className='flex flex-row justify-between object-center center center my-5 align-middle justify-items-center snap-'>
        <div className='flex flex-col'>
        <h2 className='text-2xl font-bold'>Phone Book</h2>
          <p className='text-gray-300 text-sm'>{username}</p>
        </div>
        <div className='flex gap-3'>
        <button className='overflow-hidden w-[39.99px] rounded-full h-[39.99px] ease-in-out delay-150 hover:rotate-45 duration-300' title="Create contact" aria-label="Create contact" onClick={() => setIsCreatingContact(!isCreatingContact)} >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#D9D9D9"/>
        <rect x="98" y="40" width="11" height="121" rx="5.5" fill="#2E2E2E"/>
        <rect x="98" y="40" width="11" height="121" rx="5.5" fill="#2E2E2E"/>
        <rect x="98" y="40" width="11" height="121" rx="5.5" fill="#2E2E2E"/>
        <rect x="98" y="40" width="11" height="121" rx="5.5" fill="#2E2E2E"/>
        <rect x="164" y="95" width="10" height="121" rx="5" transform="rotate(90 164 95)" fill="#2E2E2E"/>
        <rect x="164" y="95" width="10" height="121" rx="5" transform="rotate(90 164 95)" fill="#2E2E2E"/>
        <rect x="164" y="95" width="10" height="121" rx="5" transform="rotate(90 164 95)" fill="#2E2E2E"/>
        <rect x="164" y="95" width="10" height="121" rx="5" transform="rotate(90 164 95)" fill="#2E2E2E"/>
        </svg>
        </button>
        <button
        title='Logout'
        aria-label='Logout'
        onClick={handleLogout}
        className='bg-red-400 px-3 py-2 rounded-full h-fit'>Logout</button>
        </div>
        
    </div>

      {/* Add Contact Form */}
      <div className='flex-col items-center flex '>
        {isCreatingContact && (
          <div className='mx-10 md:w-[550px] sd:w-[100px]'>
            <form onSubmit={addContact} className='flex flex-col gap-2'>
        <div className='w-full flex flex-col items-center'>
        <div
          className='overflow-hidden border border-zinc-800 rounded-full m-4 sm:w-[250px]
          md:w-[270px] lg:w-[300px] aspect-1 flex items-center justify-center cursor-pointer focus:outline-none focus:shadow-outline text-center object-fit: cover'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
        
          {newContact.photo ? (
            <div className='relative w-[300px] h-fit object-fit: cover sm:w-[250px] md:w-[270px] lg:w-[300px] aspect-1'>
              <img
              src={URL.createObjectURL(newContact.photo)}
              alt='Preview'
            />
            </div>
          ) : (
            <div className='relative w-fit h-fit'>
              <p className='absolute top-1/2 left-1/2 -translate-y-[50%] -translate-x-[50%] md:text-[10px]'>Drag and drop an image here or click to select a file</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="283" height="283" viewBox="0 0 283 283">
  <g id="Ellipse_1" data-name="Ellipse 1" fill="none" stroke="##27272a" strokeWidth="2">
    <circle cx="141.5" cy="141.5" r="141.5" stroke="none"/>
    <circle cx="141.5" cy="141.5" r="140.5" fill="none"/>
  </g>
  <g id="Group_1" data-name="Group 1" transform="translate(69.412 -82.219)">
    <g id="Ellipse_2" data-name="Ellipse 2" transform="translate(52.588 164.219)" fill="none" stroke="#27272a" strokeWidth="2">
      <ellipse cx="19.5" cy="19" rx="19.5" ry="19" stroke="none"/>
      <ellipse cx="19.5" cy="19" rx="18.5" ry="18" fill="none"/>
    </g>
    <g id="Path_1" data-name="Path 1" transform="translate(32.513 199.061)" fill="none">
      <path d="M39.574,8C61.431,8,79.149,21.476,79.149,43.332s-23,25.587-39.574,25.587S0,65.189,0,43.332,17.718,8,39.574,8Z" stroke="none"/>
      <path d="M 39.57440185546875 9.999992370605469 C 29.17233276367188 9.999992370605469 19.69493103027344 13.19356918334961 12.8880615234375 18.99242782592773 C 9.450057983398438 21.92131042480469 6.771141052246094 25.43280410766602 4.925727844238281 29.42937088012695 C 2.984352111816406 33.63373565673828 2 38.31133651733398 2 43.33224105834961 C 2 45.78328704833984 2.314727783203125 48.07027435302734 2.935447692871094 50.12966156005859 C 3.512306213378906 52.04354858398438 4.370635986328125 53.8160285949707 5.486579895019531 55.39789962768555 C 7.5335693359375 58.29951095581055 10.53896331787109 60.69259643554688 14.41927337646484 62.51066589355469 C 20.66240310668945 65.43580627441406 29.12580108642578 66.91896820068359 39.57440185546875 66.91896820068359 C 50.02300262451172 66.91896820068359 58.48640441894531 65.43580627441406 64.72953033447266 62.51066589355469 C 68.60984039306641 60.69259643554688 71.615234375 58.29951095581055 73.66222381591797 55.39789962768555 C 74.77816772460938 53.8160285949707 75.63649749755859 52.04354858398438 76.21335601806641 50.12966156005859 C 76.83407592773438 48.07027435302734 77.1488037109375 45.78328704833984 77.1488037109375 43.33224105834961 C 77.1488037109375 38.31133651733398 76.16445159912109 33.63373565673828 74.22307586669922 29.42937088012695 C 72.37766265869141 25.43280410766602 69.69874572753906 21.92131042480469 66.2607421875 18.99242782592773 C 59.45386123657227 13.19356918334961 49.97647094726562 9.999992370605469 39.57440185546875 9.999992370605469 M 39.57440185546875 7.999992370605469 C 61.43073272705078 7.999992370605469 79.1488037109375 21.47591018676758 79.1488037109375 43.33224105834961 C 79.1488037109375 65.18856811523438 56.15167236328125 68.91896820068359 39.57440185546875 68.91896820068359 C 22.99713134765625 68.91896820068359 0 65.18856811523438 0 43.33224105834961 C 0 21.47591018676758 17.71805953979492 7.999992370605469 39.57440185546875 7.999992370605469 Z" stroke="none" fill="#27272a"/>
    </g>
  </g>
</svg>

            </div>
          )}
          <input
            type='file'
            accept='image/*'
            onChange={handlePhotoChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
        </div>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={newContact.name}
          onChange={handleInputChange}
          className='shadow appearance-none rounded-md w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
        />
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={newContact.email}
          onChange={handleInputChange}
          className='shadow appearance-none rounded-md w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
        />
        <input
          type='tel'
          name='phone'
          placeholder='Phone'
          value={newContact.phone}
          onChange={handleInputChange}
          className='shadow appearance-none rounded-md w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
        />
        <button type='submit' title='Add Contact' aria-label='Add Contact' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
          Add Contact
        </button>
      </form>
          </div>
        )}
      <div className='mx-10 md:w-[550px] sd:w-[100px]'>
      
      </div>
      </div>

      {/* Edit Contact Form */}
      <div className='flex-col items-center flex '>
        {isUpdatingContact && (
          <div className='mx-10 md:w-[550px] sd:w-[100px]'>
            <form onSubmit={updateContact} className='flex flex-col gap-2'>
        <div className='w-full flex flex-col items-center'>
        <div
  className='overflow-hidden border border-zinc-800 rounded-full m-4 sm:w-[250px]
  md:w-[270px] lg:w-[300px] aspect-1 flex items-center justify-center cursor-pointer focus:outline-none focus:shadow-outline text-center object-fit: cover'
  onDragOver={handleDragOver}
  onDrop={handleDrop}
  onClick={() => fileInputRef.current.click()}
>
  {newContact.photo ? (
    typeof newContact.photo === 'string' ? (
      <div className='relative w-[300px] h-fit object-fit: cover sm:w-[250px] md:w-[270px] lg:w-[300px] aspect-1'>
        <img
          src={newContact.photo} // Directly use the URL here
          alt='Preview'
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
    ) : (
      <div className='relative w-[300px] h-fit object-fit: cover sm:w-[250px] md:w-[270px] lg:w-[300px] aspect-1'>
        <img
          src={URL.createObjectURL(newContact.photo)} // Use createObjectURL for File objects
          alt='Preview'
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
    )
  ) : (
    <div className='relative w-fit h-fit'>
      <p className='absolute top-1/2 left-1/2 -translate-y-[50%] -translate-x-[50%] md:text-[10px]'>Drag and drop an image here or click to select a file</p>
      <svg xmlns="http://www.w3.org/2000/svg" width="283" height="283" viewBox="0 0 283 283">
        <g id="Ellipse_1" data-name="Ellipse 1" fill="none" stroke="##27272a" strokeWidth="2">
          <circle cx="141.5" cy="141.5" r="141.5" stroke="none"/>
          <circle cx="141.5" cy="141.5" r="140.5" fill="none"/>
        </g>
        <g id="Group_1" data-name="Group 1" transform="translate(69.412 -82.219)">
          <g id="Ellipse_2" data-name="Ellipse 2" transform="translate(52.588 164.219)" fill="none" stroke="#27272a" strokeWidth="2">
            <ellipse cx="19.5" cy="19" rx="19.5" ry="19" stroke="none"/>
            <ellipse cx="19.5" cy="19" rx="18.5" ry="18" fill="none"/>
          </g>
          <g id="Path_1" data-name="Path 1" transform="translate(32.513 199.061)" fill="none">
            <path d="M39.574,8C61.431,8,79.149,21.476,79.149,43.332s-23,25.587-39.574,25.587S0,65.189,0,43.332,17.718,8,39.574,8Z" stroke="none"/>
            <path d="M 39.57440185546875 9.999992370605469 C 29.17233276367188 9.999992370605469 19.69493103027344 13.19356918334961 12.8880615234375 18.99242782592773 C 9.450057983398438 21.92131042480469 6.771141052246094 25.43280410766602 4.925727844238281 29.42937088012695 C 2.984352111816406 33.63373565673828 2 38.31133651733398 2 43.33224105834961 C 2 45.78328704833984 2.314727783203125 48.07027435302734 2.935447692871094 50.12966156005859 C 3.512306213378906 52.04354858398438 4.370635986328125 53.8160285949707 5.486579895019531 55.39789962768555 C 7.5335693359375 58.29951095581055 10.53896331787109 60.69259643554688 14.41927337646484 62.51066589355469 C 20.66240310668945 65.43580627441406 29.12580108642578 66.91896820068359 39.57440185546875 66.91896820068359 C 50.02300262451172 66.91896820068359 58.48640441894531 65.43580627441406 64.72953033447266 62.51066589355469 C 68.60984039306641 60.69259643554688 71.615234375 58.29951095581055 73.66222381591797 55.39789962768555 C 74.77816772460938 53.8160285949707 75.63649749755859 52.04354858398438 76.21335601806641 50.12966156005859 C 76.83407592773438 48.07027435302734 77.1488037109375 45.78328704833984 77.1488037109375 43.33224105834961 C 77.1488037109375 38.31133651733398 76.16445159912109 33.63373565673828 74.22307586669922 29.42937088012695 C 72.37766265869141 25.43280410766602 69.69874572753906 21.92131042480469 66.2607421875 18.99242782592773 C 59.45386123657227 13.19356918334961 49.97647094726562 9.999992370605469 39.57440185546875 9.999992370605469 M 39.57440185546875 7.999992370605469 C 61.43073272705078 7.999992370605469 79.1488037109375 21.47591018676758 79.1488037109375 43.33224105834961 C 79.1488037109375 65.18856811523438 56.15167236328125 68.91896820068359 39.57440185546875 68.91896820068359 C 22.99713134765625 68.91896820068359 0 65.18856811523438 0 43.33224105834961 C 0 21.47591018676758 17.71805953979492 7.999992370605469 39.57440185546875 7.999992370605469 Z" stroke="none" fill="#27272a"/>
          </g>
        </g>
      </svg>
    </div>
  )}
  <input
    type='file'
    accept='image/*'
    onChange={handlePhotoChange}
    ref={fileInputRef}
    style={{ display: 'none' }}
  />
        </div>
        </div>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={newContact.name}
          onChange={handleInputChange}
          className='shadow appearance-none rounded-md w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
        />
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={newContact.email}
          onChange={handleInputChange}
          className='shadow appearance-none rounded-md w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
        />
        <input
          type='tel'
          name='phone'
          placeholder='Phone'
          value={newContact.phone}
          onChange={handleInputChange}
          className='shadow appearance-none rounded-md w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
        />
        <button
          onClick= {() => {
            updateContact(contacts.id)
          }}
          title='Add Contact' aria-label='Add Contact' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
          Update Contact
        </button>
        <button type='button'
        onClick={() => {
          cancelHandler()
        }}
        title='Add Contact' aria-label='Add Contact' className='bg-zinc-800 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
          Cancel
        </button>
      </form>
          </div>
        )}
      <div className='mx-10 md:w-[550px] sd:w-[100px]'>
      </div>
      </div>
      

      {/* Contact List */}
      {isCreatingContact  ? ( 
      <div className='hidden'></div>
      ) : error ? (
        <div className='flex items-center my-3 justify-center'>
          <div className='text-red-500'>{error}</div>
        </div>
      ) :isUpdatingContact ? (
        <div className='hidden'></div>
      ) : error ? (
        <div className='flex items-center my-3 justify-center'>
          <div className='text-red-500'>{error}</div>
        </div>
      ) : isLoading ? (
        <div className='text-center'>Loading...</div>
      ) : error ? (
        <div className='flex items-center my-3 justify-center'>
          <div className='text-red-500'>{error}</div>
        </div>
      ) : (
        <ul>
          {contacts.map((contact) => (
            <Contact
              key={contact.id}
              contact={contact}
              emailContact={emailContact}
              callContact={callContact}
              deleteContact={deleteContact}
              openEditForm={openEditForm}
              setIsUpdatingContact={setIsUpdatingContact}
            />
      ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
