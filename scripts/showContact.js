const fname = document.querySelector('#fname');
const lname = document.querySelector('#lname');
const phone = document.querySelector('#phone');
const email = document.querySelector('#email');
const save = document.querySelector('#save-contact');
const cancel = document.querySelector('#cancel-edit');
const title = document.querySelector('title');

const url = window.location.href;
const contactFullName = url.substring(url.indexOf('#')+1).split('-');

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
                showAlert('This contact already exists', 'warning');
            } else {
                valid += 1;
            }
        })
        if(valid == contacts.length){
            contacts.push(contact);
            localStorage.setItem('contacts', JSON.stringify(contacts));
        }
    }
    static removeContact(fname, lname){
        const contacts = Store.getContacts();
        contacts.forEach((contact, index) => {
            if(contact.fname == fname && contact.lname == lname){
                contacts.splice(index, 1);
            }
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

title.textContent = `My contacts | ${contactFullName[0]} ${contactFullName[1]}`;

let contacts = Store.getContacts();

contacts.forEach( x => {
    if(x.fname == contactFullName[0] && x.lname == contactFullName[1]){
        fname.value = x.fname;
        lname.value = x.lname;
        phone.value = x.phone;
        email.value = x.email;
    }
})

const fnameOrg = fname.value;
const lnameOrg = lname.value;
const phoneOrg = phone.value;
const emailOrg = email.value;

if(contactFullName[2] == 'edit'){
    editMode();
}

function editMode(){
    save.style.display = 'inline';
    cancel.style.display = 'inline';
    window.location.href = `../subpages/showContact.html#${fnameOrg}-${lnameOrg}-edit`;
}
function showAlert(message,className){
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const beforeElement = container.firstElementChild;

    container.insertBefore(div, beforeElement);

    // Vanish in 3 secs
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
}

fname.addEventListener('click', editMode);
lname.addEventListener('click', editMode);
phone.addEventListener('click', editMode);
email.addEventListener('click', editMode);
save.addEventListener('click', (e)=>{
    e.preventDefault();
    contacts.forEach( x => {
        if(x.fname == contactFullName[0] && x.lname == contactFullName[1]){
            Store.removeContact(x.fname,x.lname);
            x.fname = fname.value;
            x.lname = lname.value;
            x.phone = phone.value ;
            x.email = email.value;
            Store.addContact(x);
            window.location.href = `../subpages/showContact.html#${x.fname}-${x.lname}`;
            title.textContent = `My contacts | ${x.fname} ${x.lname}`;
        }
    });
    save.style.display = 'none';
    cancel.style.display = 'none';
    showAlert('Changes saved!', 'success');
});
cancel.addEventListener('click', (e)=>{
    e.preventDefault();
    fname.value = fnameOrg;
    lname.value = lnameOrg;
    phone.value = phoneOrg;
    email.value = emailOrg;

    save.style.display = 'none';
    cancel.style.display = 'none';
    window.location.href = `../subpages/showContact.html#${fnameOrg}-${lnameOrg}`;
})