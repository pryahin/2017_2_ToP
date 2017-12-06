import TopComponent from '../../../TopComponent/TopComponent';
import GameText from '../../GameText/GameText';
import AudioPlayer from '../../AudioPlayer/AudioPlayer';
import RecordPlayer from '../../RecordPlayer/RecordPlayer';
import Button from '../../../Button/Button';

import {RECORDING_TEXT1, RECORDING_TEXT2, SEND_BUTTON} from '../../../../constants/Stages';

import './Recording.scss';

export default class Recording extends TopComponent {
    constructor(data, autoreverse = false) {
        super('div', {'class': 'recording-stage'}, data);
        this.autoreverse = autoreverse;
        this._build();
    }

    getMusicURL() {
        return this._components[3].getMusicURL();
    }

    getMusicBlob() {
        return this._components[3].getMusicBlob();
    }

    getSubmitButton() {
        return this._components[4].getElement();
    }

    stopPlayer() {
        this._components[1].remove();
        this._components[3].stop();
    }

    getMusic() {
        this._components[1].setSource(this.getData().musicSource);
    }

    render() {
        return this.getElement();
    }

    _build() {
        this._components = [
            new GameText({text: RECORDING_TEXT1}),
            new AudioPlayer(this.getData()),
            new GameText({text: RECORDING_TEXT2}),
            new RecordPlayer(this.autoreverse),
            new Button(SEND_BUTTON)
        ];

        this._components.forEach(element => {
            this.append(element.render());
        });
        this.getMusic();

        this._initPlayers();

    }

    _initPlayers() {
        const audioButton = this._components[1].getButton();
        const recordButton = this._components[3].getButton();

        audioButton.addEventListener('click', () => {
            this._components[3].stop();
        });

        recordButton.addEventListener('click', () => {
            this._components[1].stop();
        });
    }
}