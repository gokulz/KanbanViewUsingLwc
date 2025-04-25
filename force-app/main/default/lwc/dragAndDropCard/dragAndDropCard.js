import { api, LightningElement } from 'lwc';

export default class DragAndDropCard extends LightningElement {
    @api record;
    @api stage;
}