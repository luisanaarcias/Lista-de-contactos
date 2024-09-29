// selectores. documento todo el html. queryselector es para seleccionar en especifico.
const form = document.querySelector("#main-form");
const nameInput = document.querySelector("#name-input");
const phoneInput = document.querySelector("#phone-input");
const mainFormBtn = document.querySelector("#main-form-btn");

const contactsList = document.querySelector("#contacts-list")
const NAME_REGEX = /^[A-Z]{1}[a-z]*[ ][A-Z]{1}[a-z]*$/;
const PHONE_REGEX = /^(0212|0412|0424|0414|0426|0416)[0-9]{7}$/

let nameInputValidation = false;
let phoneInputValidation = false;

// Contactos
const contactsManagerInit = () => {
    let contacts = [];
    const publicAPI = {
        getContacs: () => {
            return contacts;
        },
        //JSDOC
        // Agregar un nuevo contacto
     /**
      *  @param {Object} newContact- el contacto agregar 
      * @param {string} newContact.id -El id del contacto
      * @param {string} newContact.name - El nombre del contacto
      * @param {string} newContact.phone - El telefono del contacto
      * @returns void
      */
     


        addContact: (newContact) => {
            contacts = contacts.concat(newContact);
            console.log("agregando un contacto...");
        },
        saveInBrowser: () => {
            localStorage.setItem("contactsList", JSON.stringify(contacts));
            console.log("guardado en el navegador")
        },

        renderContacts: () => {
            console.log(contacts);
            console.log("renderContacts");
            //Borrar el contenido de la lista
            contactsList.innerHTML = "";

            //1. Crear un bucle.
            contacts.forEach(contact =>{

            //2. Accerder a cada contacto.
            console.log(contact);

            //3. Crear un li para cada contacto.
            const listItem = document.createElement("li");
            listItem.classList.add("contacts-list-item");
            listItem.id = contact.id;

            //4. crear la estructura para cada li.
            listItem.innerHTML = `
            <div class="inputs-container">
          <input class="contacts-list-item-name-input" type="text" value="${contact.name}" readonly>
          <input class="contacts-list-item-phone-input" type="text" value="${contact.phone}"readonly>
        </div>
        <div class="btns-container">
          <button class="edit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          <button class="delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
            `;
            console.log(listItem);

            //5. Agregar el li a la ul (como un hijo)
            contactsList.append(listItem)
            })

        },

        replaceContacts: (localContacts) => {
            contacts = localContacts
        },
        deleteContact: (id) => {
         contacts = contacts.filter(contact => {
            if (id !== contact.id) {
                return contact;
            }
         });
        },

        editContact: (editContact) => {
            contacts = contacts.map(contact =>{
                if (editContact.id === contact.id){
                    return editContact;
                    
                } else{
                    return contact;
                }
            })
        }
    }
    return publicAPI;
}

const contactsManager = contactsManagerInit();

const checkValidations = () => {
    if (nameInputValidation && phoneInputValidation)
        mainFormBtn.disabled = false;
    else {
        mainFormBtn.disabled = true;
    }
}

// es la funcion para colocar en rojo o en verde el borde de los inputs.

const validateInput = (input, validation) => {
    const helpText = nameInput.parentElement.children[2];

    if (input.value === "") {
        input.classList.remove("valid");
        input.classList.remove("invalid");
        helpText.classList.remove("invalidText");

    } else if (validation) {
        input.classList.add("valid");
        input.classList.remove("invalid");
        helpText.classList.remove("invalidText");

    } else {
        input.classList.add("invalid");
        input.classList.remove("valid");
        helpText.classList.add("invalidText");
    }
};

//evento: Input la letra e que se coloca viene de evento. target es a que le estoy aplicando el evento  y value es el valor.

nameInput.addEventListener("input", e => {
    nameInputValidation = NAME_REGEX.test(nameInput.value);
    validateInput(nameInput, nameInputValidation);
    checkValidations();
});

phoneInput.addEventListener("input", e => {
    phoneInputValidation = PHONE_REGEX.test(phoneInput.value);
    validateInput(phoneInput, phoneInputValidation);
    checkValidations();
});


form.addEventListener("submit", (e) => {
    console.log("añadiendo contacto...");
    //Elimino la funcionalidad por defecto del formulario
    e.preventDefault();

    //Valido que ambas validaciones son correctas
    if (!nameInputValidation || !phoneInputValidation) return;
    console.log("Contacto validado correctamente")

    // Creo el nuevo contacto
    console.log("Creando objeto del contacto....");
    const newContact = {
        id: crypto.randomUUID(),
        name: nameInput.value,
        phone: phoneInput.value,
    }

    console.log("objeto del contacto creado", newContact)

    //Añado el contacto array
    console.log("Añadiendo el contacto...")
    contactsManager.addContact(newContact)

    //Guardo los contactos en el navegador
    console.log("Añadiendo contacto al navegador...")
    contactsManager.saveInBrowser()

//Monstrar en el html
console.log("Mostrando en el html...")
contactsManager.renderContacts()
});

contactsList.addEventListener('click',e => {
    //Seleccino el boton de eliminar
     const deleteBtn = e.target.closest('.delete-btn');
     const editBtn = e.target.closest('.edit-btn');

     //Selecciono el boton de eliminar 
     if (deleteBtn){
        //selecciono el li del boton clickeado
        const li = deleteBtn.parentElement.parentElement;
        //obtengo el id del li seleccionado 
        const id= li.id;
        contactsManager.deleteContact(id);
        // se guarda de el array actualizado en el navegador 
        contactsManager.saveInBrowser();
        // se renderiza el array sin el contacto eliminado
        contactsManager.renderContacts();
    }

    if (editBtn) {
        
        // selecciono el li 
        const li = editBtn.parentElement.parentElement;
        // Selecciono ambos inputs
        const nameImputEdit = li.children [0].children [0];
        const phoneImputEdit = li.children [0].children [1];

        let editNameValidation = NAME_REGEX.test(nameImputEdit.value);
        let editPhoneValidation = PHONE_REGEX.test(phoneImputEdit.value);
        if (!editNameValidation && editBtn.classList.contains('editando')){
            nameImputEdit.classList.add('invaliEdit');
            } else {
                nameImputEdit.classList.remove('invaliEdit');
           }
           if  (!editPhoneValidation && editBtn.classList.contains('editando')){
            phoneImputEdit.classList.add('invaliEdit');
            } else {
                phoneImputEdit.classList.remove('invaliEdit');
           }


//Se evalua si la validacion del nombre y el numero son correctas y si el Btn tiene agregada la clase editand

    if(editNameValidation && editPhoneValidation && editBtn.classList.contains('editando')) {
           // si el btn tiene la clase editando se le remueve
        editBtn.classList.remove('editando');
// Añado el atributo readonly para poder editar los contactos
        nameImputEdit.setAttribute('readonly',true);
        phoneImputEdit.setAttribute('readonly',true);
        nameImputEdit.classList.remove('edit');
        phoneImputEdit.classList.remove('edit');
          
        //  Creo el contacto editando usando la informacion del html
        const contactEdit ={
            id: li.id,
            name: nameImputEdit.value,
            phone: phoneImputEdit.value
        }
        // se crea un nuevo array con el nuevo contacto editando 
        contactsManager.editContact(contactEdit);
        // se guarda de el array actualizado en el navegador 
        contactsManager.saveInBrowser();
        //Se renderiza el array sin el contacto eliminado 
        contactsManager.renderContacts();
      }else{
        editBtn.classList.add('editando');
        // Remueve el atributo readonly para poder editar los contactos
        nameImputEdit.removeAttribute('readonly');
        phoneImputEdit.removeAttribute('readonly');
     console.log('No esta editando')
      }
    }
     });


window.onload = () => {
    //Obtengo los contactos de local storage
    const getContacsLocal = localStorage.getItem("contactsList")
    // Paso los contactos de json a javascript
    const contactsLocal = JSON.parse(getContacsLocal)
    //Compruebe si exiten contactos  guardados en el navegador
    if (!contactsLocal) {
        // Reemplazo los contactos con un array vacio
        contactsManager.renderContacts ([]);
    } else {
        //Reemplazo el array de contactos con los contactos guardados en el navegador
        contactsManager.replaceContacts(contactsLocal);
    }
    // Muestro los contactos en el html
    contactsManager.renderContacts();
}