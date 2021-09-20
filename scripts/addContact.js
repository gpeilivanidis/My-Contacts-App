class Contact{
    constructor(fname, lname = '', phone = '', email = ''){
        this.fname = fname;
        this.lname = lname;
        this.phone = phone;
        this.email = email;
    }
}
class UI{
    static deleteContact(el){
        const bodyCheckbox = document.querySelectorAll('.body-checkbox');

        if(el.classList.contains('fa-trash-alt')){
            el.parentElement.parentElement.remove();
        }
        if(el.classList.contains('delete')){
            for(let i of bodyCheckbox){
                if(i.checked == true){
                    i.parentElement.parentElement.remove();
                }
            }
        }
    }
    static emptyLetters(){
        const groupBody = document.querySelectorAll('.group-body');
        for(let i of groupBody){
            if(i.children.length == 0){
                i.parentElement.style.display = 'none';
            }
        }
    }
    static showAlert(message,className){
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');

        container.insertBefore(div, form);

        // Vanish in 3 secs
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
    static clearFields(){
        document.querySelector('#fname').value = '';
        document.querySelector('#lname').value = '';
        document.querySelector('#phone').value = '';
        document.querySelector('#email').value = '';
    }
}
class Store{
    static getContacts(){
        let contacts;
        if(localStorage.getItem('contacts') === null){
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }
        return contacts;
    }
    static addContact(contact){
        let valid = 0;
        const contacts = Store.getContacts();
        contacts.forEach((x) => {
            if(x.fname.toLowerCase() == contact.fname.toLowerCase() && x.lname.toLowerCase() == contact.lname.toLowerCase()){
                UI.showAlert('This contact already exists', 'warning');
            } else {
                valid += 1;
            }
        })
        if(valid == contacts.length){
            contacts.push(contact);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            UI.showAlert('Contact added!', 'success');
        }
    }
    static removeContact(fname, lname){
        const contacts = Store.getContacts();
        contacts.forEach((contact, index) => {
            if(contact.fname === fname && contact.lname === lname){
                contact.splice(index, 1);
            }
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

const form = document.querySelector('form');
const reset = document.querySelector('#form-reset');

form.addEventListener('submit', (e)=>{
    e.preventDefault();

    const fname = document.querySelector('#fname').value;
    const lname = document.querySelector('#lname').value;
    const phone = document.querySelector('#phone').value;
    const email = document.querySelector('#email').value;

    if(fname == '' || lname == '' || phone == ''){
        UI.showAlert('Please fill in First Name, Last Name and Phone Number', 'danger');
    }
    else{
        const contact = new Contact(fname,lname,phone,email);

        Store.addContact(contact);
        UI.clearFields();
    }
})
reset.addEventListener('click', (e)=>{
    UI.clearFields();
})