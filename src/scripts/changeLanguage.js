export const changeLanguage = () => {
    const select = document.querySelector('#lenguage')
    
    const change = () =>{
        return select.value
    } 

    select.addEventListener('change', change)
} 