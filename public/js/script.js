// bootstrap java script method for form validation 
// class which is defined in new.ejs (needs-validation) 
// uske liye hamne ye js ka logic bootstrap se liya hai

// isko hamne boilerplate me link kiya hai 

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

