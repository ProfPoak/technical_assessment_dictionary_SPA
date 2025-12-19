//Event Listener
const form = document.querySelector("form")

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const input = document.getElementById('word-search')
    const rawInput = input.value
    const inputValue = rawInput.trim()

    if(inputValue === "") {
        const errorMessage = document.getElementById('error-message')
        errorMessage.textContent = 'Please enter a word'
        errorMessage.classList.remove('hidden')
        return
    }

    fetchWord(inputValue)
})

//Fetch function and parsing
async function fetchWord(inputValue) {
    const errorMessage = document.getElementById('error-message')
    const loading = document.getElementById('loading')

    loading.classList.remove('hidden')
    errorMessage.classList.add('hidden')
    
    try {
        const dictionaryKey = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

        

        const response = await fetch(`${dictionaryKey}${inputValue}`)
        if (!response.ok) {
            throw new Error('Word not found')
        }
        const entry = await response.json()
        console.log(entry)
    }
    catch (error) {
        loading.classList.add('hidden')
        errorMessage.textContent = 'Word not found. Please try another word.'
        errorMessage.classList.remove('hidden')
    }

    loading.classList.add('hidden')
}

//Successful display function
function goodDisplay (entry) {
    const resultsContainer = document.getElementById('results-container')
    resultsContainer.innerHTML = ''
    resultsContainer.classList.remove('hidden')
    
    const data = entry[0]
    const word = data.word
    const phonetic = data.phonetic
    const meanings = data.meanings
    
    const audioArray = data.phonetics.find(item => item.audio)
    const audioURL = audioArray ? audioArray.audio : null
    
}