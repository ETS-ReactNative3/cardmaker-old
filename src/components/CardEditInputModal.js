import React, {Component} from 'react';
import {
    Text,
    View,
    Modal,
    TouchableOpacity,
} from 'react-native';
import {
    SlidersColorPicker,
} from 'react-native-color';
import tinycolor from 'tinycolor2';
import {Dropdown} from 'react-native-material-dropdown';

import EditModalStyle from '../styles/EditModal';
import cardStyle from '../styles/card';
import colorPickerStyle from '../styles/colorPicker';

import CardConfig from '../config/CardConfig';

const modes = {
    hex: {
        getString: color => tinycolor(color).toHexString(),
        label: 'HEX'
    },
    hsl: {
        getString: color => tinycolor(color).toHslString(),
        label: 'HSL'
    },
    hsv: {
        getString: color => tinycolor(color).toHsvString(),
        label: 'HSV'
    },
    rgb: {
        getString: color => tinycolor(color).toRgbString(),
        label: 'RGB'
    }
};

export default class CardEditInputModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            color: tinycolor('#70c1b3').toHsl(),
            recents: ['#247ba0', '#70c1b3', '#b2dbbf', '#f3ffbd', '#ff1654'],
            modalIndex: this.props.modalIndex,

        }
    }

    /**
     * Edit input style
     * @param size
     */
    onChangeFontSize = (size) => {
        console.log('state is :', this.state)
        var stateName = `input${this.state.modalIndex}FontSize`;
        console.log('stateName is', stateName)


        this.setState({
            [stateName]: size,
        });
    }
    onChangeFontFamily = (font) => {
        var stateName = `input${this.state.modalIndex}FontFamily`;
        this.setState({
            [stateName]: font,
        });
    }
    onChangeTextPosition = (position) => {
        var stateName = `input${this.state.modalIndex}Position`;

        this.setState({
            [stateName]: position,
        });
    }

    componentWillReceiveProps(nextProps) {
        const {modalIndex} = nextProps;
        this.setState({modalIndex: modalIndex})
    }

    render() {
        const {
            visible,
            onOk,
            onCancel,
            okLabel,
            cancelLabel,
            modalIndex
        } = this.props;
        console.log('modalIndex is ', modalIndex)
        var fontSize = `input${modalIndex}FontSize`;
        var fontFamily = `input${modalIndex}FontFamily`;
        var textPosition = `input${modalIndex}Position`;

        var textColor = `input${modalIndex}Color`;
        console.log('textColor ', textColor, ' is :', (this.state)[textColor])
        console.log('font family is ', (this.state)[fontFamily])

        let fontsFamily = CardConfig.allfontFamily;
        const textInfo = ((this.state)[textColor] && (this.state)[fontFamily] && (this.state)[textPosition]) ?
            `Font Color: ${(this.state)[textColor]}
        Font Family: ${(this.state)[fontFamily]}   
        textPosition: ${(this.state)[textPosition]}` : `Font Style`;
        const overlayTextColor = tinycolor(this.state.color).isDark()
            ? '#FAFAFA'
            : '#222';
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={visible}
                onRequestClose={onCancel}
            >
                <View style={EditModalStyle.container}>
                    <View style={EditModalStyle.header}>
                        <TouchableOpacity onPress={onCancel}>
                            <Text style={EditModalStyle.headerButton}>{cancelLabel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                onOk((this.state)[textColor], (this.state)[fontSize], (this.state)[fontFamily], (this.state)[textPosition])
                            }
                        >
                            <Text style={EditModalStyle.headerButton}>{okLabel}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={EditModalStyle.content}>

                        <View style={[cardStyle.container, cardStyle.wrapper]}>

                            <Text style={[colorPickerStyle.sectionText, {
                                color: (this.state)[textColor],
                                fontFamily: (this.state)[fontFamily]
                            }]}>{textInfo}</Text>
                            <TouchableOpacity
                                onPress={() => this.setState({modalVisible: true})}
                                style={[
                                    colorPickerStyle.colorPreview,
                                    {backgroundColor: tinycolor((this.state)[textColor]).toHslString()}
                                ]}
                            >
                                <Text style={[colorPickerStyle.colorString, {color: overlayTextColor}]}>
                                    {tinycolor((this.state)[textColor]).toHexString()}
                                </Text>
                            </TouchableOpacity>


                            <SlidersColorPicker
                                visible={this.state.modalVisible}
                                color={this.state.color}
                                returnMode={'hex'}
                                onCancel={() => this.setState({modalVisible: false})}
                                onOk={colorHex => {
                                    var stateName = `input${modalIndex}Color`;

                                    this.setState({
                                        modalVisible: false,
                                        color: tinycolor(colorHex).toHsl(),
                                        [stateName]: colorHex,

                                    });
                                    this.setState({
                                        recents: [
                                            colorHex,
                                            ...this.state.recents.filter(c => c !== colorHex).slice(0, 4)
                                        ]
                                    });
                                }}
                                swatches={this.state.recents}
                                swatchesLabel="RECENTS"
                                okLabel="Done"
                                cancelLabel="Cancel"
                            />
                            <Dropdown
                                label='Font Size'
                                data={CardConfig.fontSize}
                                onChangeText={this.onChangeFontSize}
                            />
                            <Dropdown
                                label='Font Family'
                                data={fontsFamily}
                                setFontFamily={true}
                                onChangeText={this.onChangeFontFamily}
                            />

                            <Dropdown
                                label='Text Position'
                                data={CardConfig.textPostion}
                                onChangeText={this.onChangeTextPosition}
                            />

                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}