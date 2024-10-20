
<script setup>

import { ref, onMounted } from 'vue'

let mainBlock = null

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

function createSpanText(textBlock, text, tone) {
    let textElem = document.createElement('span')
    textElem.textContent = text

    if (tone != null) {
        textElem.style.backgroundColor = getColor(tone)
    }

    textBlock.appendChild(textElem)
}

function getInfo(data) {

    for (let curBlockIndex = 0; curBlockIndex < data.length; curBlockIndex++) {
        let textBlock = document.createElement('div')
        textBlock.style.padding = '1% 2%'

        let hr = document.createElement('hr')

        let textInfo = document.createElement('p')
        textInfo.style.paddingBottom = '1%'
        textInfo.textContent = ` ${data[curBlockIndex].date.substr(0, 10)} / ${data[curBlockIndex].authorName} / ${data[curBlockIndex].authorUrl}`;

        textBlock.appendChild(textInfo)

        let holeText = data[curBlockIndex].content
        let textSettings = data[curBlockIndex].contentPostTones

        for (let curSetting = 0; curSetting < textSettings.length; curSetting++) {

            if (textSettings.length > 0 && textSettings[0].position > 0) {
                createSpanText(textBlock, holeText.substring(0, textSettings[curSetting].position), null)
            }

            let coloredStart = textSettings[curSetting].position
            let coloredLength = textSettings[curSetting].length

            createSpanText(textBlock, holeText.substring(coloredStart, coloredStart + coloredLength), textSettings[curSetting].tone)

            if (curSetting < textSettings.length - 1) {
                createSpanText(textBlock, holeText.substring(coloredStart + coloredLength, textSettings[curSetting + 1].position), null)
            }
            else if ((coloredStart + coloredLength) < holeText.length) {
                createSpanText(textBlock, holeText.substring(coloredStart + coloredLength, holeText.length), null)
            }

        }

        mainBlock.appendChild(textBlock)
        mainBlock.appendChild(hr)
    }
}

onMounted(() => {
    mainBlock = document.getElementById('mainBlock')

    fetch('src/assets/feed.json')
    .then(res => res.json())
    .then(data => getInfo(data))
    .catch(err => console.error('Ошибка:', err))
})

</script>

<template>
    <div id="mainBlock"></div>
</template>

<style scoped>
</style>
