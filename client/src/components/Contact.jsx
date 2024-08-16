import React from 'react';

const Contact = ({ contact, emailContact, callContact, deleteContact, openEditForm, setIsUpdatingContact, setUpdateContact }) => {
  return (
    <li key={contact.id} className="mx-10 my-5">
      <div className="flex items-center my-3 justify-between">
        <div className="flex flex-row gap-2">
          {contact.photoLink ? (
            <div className="aspect-1 h-16 mr-3 overflow-hidden rounded-full">
              <img
                src={`https://phonbook-i39g.onrender.com/api/images/${contact.photoLink}`}
                alt={contact.name}
                onError={(e) => {
                  e.target.src = './react.svg';
                }}
              />
            </div>
          ) : (
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 mr-3"
            >
              <rect width="200" height="200" fill="#D9D9D9" />
              <rect
                x="98"
                y="40"
                width="11"
                height="121"
                rx="5.5"
                fill="#2E2E2E"
              />
              <rect
                x="98"
                y="40"
                width="11"
                height="121"
                rx="5.5"
                fill="#2E2E2E"
              />
              <rect
                x="98"
                y="40"
                width="11"
                height="121"
                rx="5.5"
                fill="#2E2E2E"
              />
              <rect
                x="98"
                y="40"
                width="11"
                height="121"
                rx="5.5"
                fill="#2E2E2E"
              />
              <rect
                x="164"
                y="95"
                width="10"
                height="121"
                rx="5"
                transform="rotate(90 164 95)"
                fill="#2E2E2E"
              />
              <rect
                x="164"
                y="95"
                width="10"
                height="121"
                rx="5"
                transform="rotate(90 164 95)"
                fill="#2E2E2E"
              />
              <rect
                x="164"
                y="95"
                width="10"
                height="121"
                rx="5"
                transform="rotate(90 164 95)"
                fill="#2E2E2E"
              />
              <rect
                x="164"
                y="95"
                width="10"
                height="121"
                rx="5"
                transform="rotate(90 164 95)"
                fill="#2E2E2E"
              />
            </svg>
          )}
          <div>
            <span className="font-medium text-[20px]">{contact.name}</span>
            <br />
            <div>
              <p className="font-light text-[13px] text-zinc-200">
                {contact.email}
              </p>
              <p className="font-light text-[13px] text-zinc-200">
                {contact.phone}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <ActionButton
            title="Email"
            ariaLabel="Email"
            onClick={() => emailContact(contact.email)}
            icon="./emailIcon.svg"
            alt="Email Icon"
            bgColor="hover:bg-yellow-500"
          />
          <ActionButton
            title="Call"
            ariaLabel="Call"
            onClick={() => callContact(contact.phone)}
            icon="./phoneIcon.svg"
            alt="Call Icon"
            bgColor="hover:bg-green-700"
          />
          <ActionButton
            title="Edit Contact"
            ariaLabel="Edit Contact"
            onClick={() => {setIsUpdatingContact(true); openEditForm(contact.id)}}
            icon="./editIcon.svg"
            alt="Edit Icon"
            bgColor="hover:bg-zinc-700"
          />
          <ActionButton
            title="Delete Contact"
            ariaLabel="Delete Contact"
            onClick={() => deleteContact(contact.id)}
            icon="./deleteIcon.svg"
            alt="Delete Icon"
            bgColor="hover:bg-red-500"
          />
        </div>
      </div>
    </li>
  );
};

const ActionButton = ({ title, ariaLabel, onClick, icon, alt, bgColor }) => (
  <div
    title={title}
    aria-label={ariaLabel}
    onClick={onClick}
    className={`${bgColor} text-white text-[15px] font-normal hover:font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer flex justify-center items-center`}
  >
    <img src={icon} alt={alt} className="w-5 h-5" />
  </div>
);

export default Contact;
