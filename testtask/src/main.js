import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

let block = document.getElementById('mess')

function getColor(tone) {
    if (tone == -1) {
        return 'rgb(255 0 0)'
    }
    if (tone == 0) {
        return 'rgb(255 255 0)'
    }
    if (tone == 1) {
        return 'rgb(0 255 0)'
    }
    if (tone < 0) {
        return 'rgb(255 ' + Math.floor(Math.abs(255 * tone)) + ' 0)'
    }
    if (tone < 1) {
        return 'rgb(' + (255 - Math.floor(255 * tone)) + ' 255 0)'
    }
}

function createSpanText(divBlock, holeText, sbstrFirst, sbstrSecond, tone) {
    if (tone == null) {
        let textElem = document.createElement('span')
        textElem.textContent = holeText.substring(sbstrFirst, sbstrSecond)
        divBlock.appendChild(textElem)
    }
    if (tone != null) {
        let textElem = document.createElement('span')
        textElem.textContent = holeText.substring(sbstrFirst, sbstrSecond)
        textElem.style.backgroundColor = getColor(tone)
        divBlock.appendChild(textElem)
    }
}

function getInfo(data) {
    for (let curBlockIndex = 0; curBlockIndex < data.length; curBlockIndex++) {
        let divBlock = document.createElement('div')
        divBlock.style.padding = '1% 2%'

        let hr = document.createElement('hr')

        let textInfo = document.createElement('p')
        textInfo.style.paddingBottom = '1%'
        textInfo.textContent = ` ${data[curBlockIndex].date.substr(0, 10)} / ${data[curBlockIndex].authorName} / ${data[curBlockIndex].authorUrl}`;

        divBlock.appendChild(textInfo)

        let holeText = data[curBlockIndex].content
        let textSettings = data[curBlockIndex].contentPostTones



        for (let curSetting = 0; curSetting < textSettings.length; curSetting++) {

            if (textSettings.length > 0 && textSettings[0].position > 0) {
                let textElem = document.createElement('span')
                textElem.textContent = holeText.substring(0, textSettings[curSetting].position)
                divBlock.appendChild(textElem)
            }

            let curPosition = textSettings[curSetting].position
            let sizeSettings = textSettings[curSetting].length

            createSpanText(divBlock, holeText, curPosition, curPosition + sizeSettings, textSettings[curSetting].tone)

            if (curSetting < textSettings.length - 1) {
                createSpanText(divBlock, holeText, curPosition + sizeSettings, textSettings[curSetting + 1].position, null)
            }

            if ((curSetting == textSettings.length - 1) && (curPosition + sizeSettings) < holeText.length) {
                createSpanText(divBlock, holeText, curPosition + sizeSettings, holeText.length, null)
            }

        }

        block.appendChild(divBlock)
        block.appendChild(hr)
    }
}

fetch('src/assets/feed.json')
    .then(res => res.json())
    .then(data => getInfo(data))
    .catch(err => console.error('Ошибка:', err))
