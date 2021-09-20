// GETTING ELEMENTS

// static elements
const alphabet =            ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const search =              document.querySelector('input[type="search"]');
const selectAllCheckbox =   document.querySelector('#select-all-checkbox');
const selectAll =           document.querySelector('#select-all');
const topButtons =          document.querySelector('#top-buttons');
const cancelBtn =           document.querySelector('.cancel');
const deleteBtn =           document.querySelector('.delete');

class Contact{
    constructor(fname, lname = '', phone = '', email = ''){
        this.fname = fname;
        this.lname = lname;
        this.phone = phone;
        this.email = email;
    }
}
class UI{
    static displayContact(){
        let contacts = Store.getContacts();
        function compare( a, b ) {
            if ( a.fname.toLowerCase() < b.fname.toLowerCase() ){
              return -1;
            }
            if ( a.fname.toLowerCase() > b.fname.toLowerCase() ){
              return 1;
            }
            return 0;
        }
        contacts = contacts.sort(compare);
        contacts.forEach( contact => UI.addContactToList(contact) );
    }
    static addContactToList(contact){
        // THIS METHOD ONLY ADDS EXISTING CONTACTS TO THE UI LIST

        const lettersHeader = document.querySelectorAll('.head-letter'); 
        const link = document.createElement('a');
        link.classList.add('contact-link');
        link.href = `./subpages/showContact.html#${contact.fname}-${contact.lname}`;

        const groupBodyLi = document.createElement('li');
        groupBodyLi.classList.add('group-body-li');
        groupBodyLi.addEventListener('mouseenter', hoverEffect);
        groupBodyLi.addEventListener('mouseleave', hoverEffect);

        const bodyCheckbox = document.createElement('input');
        bodyCheckbox.type = 'checkbox';
        bodyCheckbox.classList.add('body-checkbox');
        bodyCheckbox.addEventListener('click', selectMode);
        bodyCheckbox.addEventListener('click', checkParent);

        const contactName = document.createElement('span');
        contactName.classList.add('contact-name');
        contactName.textContent = `${contact.fname} ${contact.lname}`;

        const iEdit = document.createElement('i');
        iEdit.className = 'far fa-edit';
        iEdit.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`./subpages/showContact.html#${contact.fname}-${contact.lname}-edit`, '_self');
        });

        const iDelete = document.createElement('i');
        iDelete.className = 'far fa-trash-alt';
        iDelete.addEventListener('click', (e) => {
            e.preventDefault();
            UI.deleteContact(e.target);
            UI.showAlert('Contacts succesfuly removed!','success');
            UI.emptyLetters();
        });

        groupBodyLi.appendChild(bodyCheckbox);
        groupBodyLi.appendChild(contactName);
        groupBodyLi.appendChild(iEdit);
        groupBodyLi.appendChild(iDelete);
        link.appendChild(groupBodyLi);
        
        const index = alphabet.indexOf(contact.fname[0].toUpperCase());
        const groupBody = lettersHeader[index].parentElement.nextElementSibling;
        if(groupBody.children.length == 0){
            groupBody.parentElement.style.display = 'block';
        }
        groupBody.appendChild(link);
    }
    static deleteContact(el){
        const bodyCheckbox = document.querySelectorAll('.body-checkbox');

        if(el.classList.contains('fa-trash-alt')){
            const arr = el.previousElementSibling.previousElementSibling.textContent.split(' ');
            Store.removeContact(arr[0],arr[1]);
            el.parentElement.parentElement.remove();
        }
        if(el.classList.contains('delete')){
            for(let i of bodyCheckbox){
                if(i.checked == true){
                    const arr = i.nextElementSibling.textContent.split(' ');
                    Store.removeContact(arr[0],arr[1]);
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
        const beforeElement = container.firstElementChild;

        container.insertBefore(div, beforeElement);

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
(function lettersInitialization(){
    for(let i = 0; i < alphabet.length; i++){
        const groupLetter = document.createElement('li');
        groupLetter.classList.add('group-letter');

        const groupHead = document.createElement('div');
        groupHead.classList.add('group-head');
        groupHead.addEventListener('mouseenter', hoverEffect);
        groupHead.addEventListener('mouseleave', hoverEffect);
        groupHead.addEventListener('click', collapse);

        const headCheckbox = document.createElement('input');
        headCheckbox.type = 'checkbox';
        headCheckbox.classList.add('head-checkbox');
        headCheckbox.addEventListener('click', selectMode);
        headCheckbox.addEventListener('click', checkChildren);

        const headLetter = document.createElement('span');
        headLetter.classList.add('head-letter');
        headLetter.textContent = alphabet[i];

        const groupBody = document.createElement('ul');
        groupBody.classList.add('group-body');

        groupHead.appendChild(headCheckbox);
        groupHead.appendChild(headLetter);
        groupLetter.appendChild(groupHead);
        groupLetter.appendChild(groupBody);

        document.querySelector('.container').firstElementChild.appendChild(groupLetter);
    }
    UI.emptyLetters();
})();
document.addEventListener('DOMContentLoaded', UI.displayContact);
// node list
const groupHeads =          document.querySelectorAll('.group-head');       //<div class="group-head">headCheckbox && headLetter</div>
const headCheckboxes =      document.querySelectorAll('.head-checkbox');    //<input type="checkbox" class="head-checkbox">
const headLetters =         document.querySelectorAll('.head-letter');      //<span class="head-letter">A</span>

// EVENT FUNCTIONS

function hoverEffect(e){
    // showing icons and checkboxes
    for(let i = 0; i < e.target.children.length; i++){
        if(e.target.children[i].classList.contains('fa-edit') || e.target.children[i].classList.contains('fa-trash-alt') || e.target.children[i].classList.contains('body-checkbox') || e.target.children[i].classList.contains('head-checkbox')){
            if(e.type == 'mouseenter'){
                e.target.children[i].style.display = 'block';
            } else if (e.type == 'mouseleave'){
                e.target.children[i].style.display = 'none';
            }
        }
    }
}
function collapse(){
    if(this.nextElementSibling.style.display == 'block' || this.nextElementSibling.style.display == ''){
        this.nextElementSibling.style.display = 'none';
    } else if(this.nextElementSibling.style.display == 'none'){
        this.nextElementSibling.style.display = 'block';
    }
}
function selectMode(e){
    // SHOW ALL CHECKBOXES, HIDE THE REST

    const groupBodyLi =     document.querySelectorAll('.group-body-li');
    const bodyCheckbox =    document.querySelectorAll('.body-checkbox');
    const iEdit =           document.querySelectorAll('.fa-edit');
    const iDelete =         document.querySelectorAll('.fa-trash-alt');
    // there is a link behind the checkbox
    e.stopPropagation();
    // removing hovering effect
    for(let i of groupBodyLi){
        i.removeEventListener('mouseenter', hoverEffect);
        i.removeEventListener('mouseleave', hoverEffect);
    }
    for(let i of groupHeads){
        i.removeEventListener('mouseenter', hoverEffect);
        i.removeEventListener('mouseleave', hoverEffect);
    }
    // showing checkboxes
    for(let i of bodyCheckbox){
        i.style.display = 'block';
    }
    for(let i of headCheckboxes){
        i.style.display = 'block';
    }
    // hiding icons
    for(let i of iEdit){
        i.style.display = 'none';
    }
    for(let i of iDelete){
        i.style.display = 'none';
    }
    // showing delete controls
    topButtons.style.display = 'inline';
    selectAllCheckbox.style.display = 'inline';
    selectAll.style.display = 'inline';
}
function cancel(){
    // LEAVE SELECT MODE

    const groupBodyLi = document.querySelectorAll('.group-body-li');
    const bodyCheckbox = document.querySelectorAll('.body-checkbox');
    // adding back eventListeners
    for(let i of groupBodyLi){
        i.addEventListener('mouseenter', hoverEffect);
        i.addEventListener('mouseleave', hoverEffect);
    }
    for(let i of groupHeads){
        i.addEventListener('mouseenter', hoverEffect);
        i.addEventListener('mouseleave', hoverEffect);
    }

    // unchecking all checkboxes
    selectAllCheckbox.checked = false;
    for(let i of headCheckboxes){
        i.checked = false;
    }
    for(let i of bodyCheckbox){
        i.checked = false;
    }

    // hiding checkboxes,icons,buttons
    for(let i of bodyCheckbox){
        i.style.display = 'none';
    }
    for(let i of headCheckboxes){
        i.style.display = 'none';
    }

    topButtons.style.display = 'none';
    selectAllCheckbox.style.display = 'none';
    selectAll.style.display = 'none';
}
function checkChildren(e){
    // if head checkbox is checked, then check all the children checkboxes
    if(e.target.getAttribute('checked') == true || e.target.getAttribute('checked') == 'true' || e.target.getAttribute('checked') == 'checked' || e.target.checked == true || e.target.checked == 'true' || e.target.checked == 'checked'){

        for(let i = 0; i < e.target.parentElement.nextElementSibling.children.length; i++){
            e.target.parentElement.nextElementSibling.children[i].firstElementChild.firstElementChild.checked = true;
        }
    // if head checkboxes gets unchecked, then uncheck all the children checkboxes 
    } else if (e.target.getAttribute('checked') == false || e.target.getAttribute('checked') == 'false' || e.target.getAttribute('checked') == '' || e.target.checked == false || e.target.checked == 'false' || e.target.checked == ''){

        for(let i = 0; i < e.target.parentElement.nextElementSibling.children.length; i++){
            e.target.parentElement.nextElementSibling.children[i].firstElementChild.firstElementChild.checked = false;
        }

    }

    // SELECT-ALL CHECKBOX
    let arr = [];
    // making sure to count only the visible head checkboxes
    for(let i of headCheckboxes){
        if(i.parentElement.parentElement.style.display != 'none'){
            arr.push(i.checked);
        }
    }
    // if all head checkboxes are checked, then check select-all checkbox
    if(arr.every( v => v == arr[0] ) ){
        selectAllCheckbox.checked = arr[0];
    } else {
        selectAllCheckbox.checked = false;
    }
}
function checkParent(e){
    const bodyCheckbox = document.querySelectorAll('.body-checkbox');
    let arr = [];
    // goes through every body checkbox in its letter group
    for(let i = 0; i < e.target.parentElement.parentElement.parentElement.children.length; i++){
        arr.push(e.target.parentElement.parentElement.parentElement.children[i].firstElementChild.firstElementChild.checked);
    }
    // if they are all true, check the head checkbox
    if(arr.every( v => v == arr[0] ) ){
        e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.checked = arr[0];
    } else {
        e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.checked = false;
        selectAllCheckbox.checked = false;
    }


    // SELECT-ALL CHECKBOX
    let arrParent = [];
    for(let i of bodyCheckbox){
        arrParent.push(i.checked);
    }
    // if all checkboxes in the document are checked, then check the selectAll checkbox
    if(arrParent.every( v => v == arr[0] ) ){
        selectAllCheckbox.checked = arr[0];
    } else {
        selectAllCheckbox.checked = false;
    }
}
function checkAll(e){
    // CHECK/UNCHECK ALL CHECKBOXES

    const bodyCheckbox = document.querySelectorAll('.body-checkbox');
    if(e.target.getAttribute('checked') == true || e.target.getAttribute('checked') == 'true' || e.target.getAttribute('checked') == 'checked' || e.target.checked == true || e.target.checked == 'true' || e.target.checked == 'checked'){

        for(let i of headCheckboxes){
            i.checked = true;
        }
        for(let i of bodyCheckbox){
            i.checked = true;
        }

    } else if (e.target.getAttribute('checked') == false || e.target.getAttribute('checked') == 'false' || e.target.getAttribute('checked') == '' || e.target.checked == false || e.target.checked == 'false' || e.target.checked == ''){

        for(let i of headCheckboxes){
            i.checked = false;
        }
        for(let i of bodyCheckbox){
            i.checked = false;
        }

    }
}
function filter(){
    // SEARCHING

    const contactNames = document.querySelectorAll('.contact-name');
    const filterValue = search.value.toLowerCase();
    // filter through names
    contactNames.forEach(function(name){
        if(name.innerHTML.toLowerCase().startsWith(filterValue)){
            name.parentElement.parentElement.style.display = '';
        } else {
            name.parentElement.parentElement.style.display = 'none';
        }
    });
    // filter through letter sections
    headLetters.forEach(function(letter){
        if(letter.innerHTML.toLowerCase().startsWith(filterValue[0])){
            letter.parentElement.parentElement.style.display = '';
        } else {
            letter.parentElement.parentElement.style.display = 'none';
        }
        if(filterValue == ""){
            letter.parentElement.parentElement.style.display = 'block';
            UI.emptyLetters();
        }
    });
}

// EVENT LISTENERS

selectAllCheckbox.addEventListener('click', checkAll);
cancelBtn.addEventListener('click', cancel);
deleteBtn.addEventListener('click', (e) => {
    UI.deleteContact(e.target);
    UI.showAlert('Contacts succesfuly removed!','success');
    UI.emptyLetters();
    cancel();
})
search.addEventListener('keyup', filter);