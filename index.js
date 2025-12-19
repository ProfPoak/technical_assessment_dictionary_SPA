//Event Listener
const form = document.querySelector("form")

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const input = document.getElementById('word-search')
    const rawInput = input.value
    //Clearing potential white space
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
        // checking for bad response
        if (!response.ok) {
            throw new Error('Word not found')
        }
        //Parsing if good response
        const entry = await response.json()
        console.log(entry)
        goodDisplay(entry)
    }
    catch (error) {
        loading.classList.add('hidden')
        errorMessage.textContent = 'Word not found. Please try another word.'
        errorMessage.classList.remove('hidden')
    }

    loading.classList.add('hidden')
}

//Display function when good response is received
function goodDisplay (entry) {
    //Clearing DOM for each search
    const resultsContainer = document.getElementById('results-container')
    resultsContainer.innerHTML = ''
    resultsContainer.classList.remove('hidden')
    
    //extracting data from the entry
    const data = entry[0]
    const word = data.word
    const phonetic = data.phonetic
    const meanings = data.meanings
    
    //Checking for an audio url to be used if available
    const audioArray = data.phonetics.find(item => item.audio)
    const audioURL = audioArray ? audioArray.audio : null

    //DOM manipulation
    const wordDisplay = document.createElement('h3')
    wordDisplay.textContent = word
    resultsContainer.append(wordDisplay)

    if (phonetic) {
        const phoneticDisplay = document.createElement('p')
        phoneticDisplay.textContent = phonetic
        resultsContainer.append(phoneticDisplay)
    }

    if (audioURL) {
        const audioDisplay = document.createElement('audio')
        audioDisplay.src = audioURL
        audioDisplay.controls = true
        resultsContainer.append(audioDisplay)
    }

    //Looping for definitions
    meanings.forEach(meaning => {
        const partOfSpeech = document.createElement('h4')
        partOfSpeech.textContent = meaning.partOfSpeech
        resultsContainer.append(partOfSpeech)

        const definitionsList = document.createElement('ol')

        //abbreviated definitions
        const abvDefinitions = meaning.definitions.slice(0,3)

        abvDefinitions.forEach(definition => {
            const definitionEntry = document.createElement('li')
            definitionEntry.textContent = definition.definition

            if (definition.example) {
                const example = document.createElement('em')
                example.textContent = ` - ${definition.example}`
                definitionEntry.append(example)
            }

            definitionsList.append(definitionEntry)

        })

        resultsContainer.append(definitionsList)

    });
    
}