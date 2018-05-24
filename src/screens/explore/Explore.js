import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ImageBackground,
    ScrollView,
    Dimensions,
    Linking,
    Alert,
    Animated,
} from 'react-native';
import {
    Icon,
    Avatar,
    ButtonGroup
} from 'react-native-elements';
import VersionCheck from 'react-native-version-check';

import Carousel from 'react-native-snap-carousel';
import Loader from 'react-native-mask-loader';
import Placeholder from 'rn-placeholder';

import layoutStyle from '../../styles/layout';
import carouselStyle from '../../styles/carousel';
import exploreStyle from '../../styles/explore';

import colors from '../../styles/colors';

import {sliderWidth, itemWidth} from '../../styles/sliderEntry';
import {HEADER_SCROLL_DISTANCE, HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT} from '../../styles/explore';

import SliderEntry from '../../components/SliderEntry';
import  logo from '../../assets/images/logo.png';

import {
    getFreeImages,
    getFreeImagesNew
} from '../../utils/FetchImagesByApi';
import {
    upDateRole
} from '../../utils/AppPay';

import  Utils from '../../utils/utils';

const birthdayImages = 'birthdayImages';
const holidayImages = 'holidayImages';
const weddingImages = 'weddingImages';
const otherImages = 'otherImages';
const downloadUrl = 'https://itunes.apple.com/us/app/cardmaker-app/id1318023993?mt=8';
const words = [

    {
        width: '60%',
    },
    {
        width: '40%',
    },
];

const component1 = () => <Text>Cards</Text>
const component2 = () => <Text>Invitations</Text>
let cardsType = {
    holiday: ["christmas", "newYear", "easter"],
    birthday: ["kids", "forHer", "forHim"],
    thankyou: ["general", "birthday", "wedding"]
}
let invitationsType = {
    holiday: ["christmas", "newYear", "easter"],
    birthday: ["kids", "women", "men"],
    wedding: ["invitation", "saveTheDate", "rsvp"]
}

export default class Explore extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            // birthdayImages: [],
            // holidayImages: [],
            // weddingImages: [],
            // otherImages: [],
            // latestImages: [],
            updatedcards: [],
            appReady: false,
            rootKey: Math.random(),
            connectionInfo: this.props.screenProps.connectionInfo,
            scrollY: new Animated.Value(0),
            imageCategory: 'cards',
            imageType: cardsType,
        };
        this.maskImage = logo;

    }


    fetchImages = (catergory, imageType) => {
        var array = []
        // return new Promise(function (resolve, reject) {
        // some async operation here
        // setTimeout(function () {
        // resolve the promise with some value
        var promises = imageType.map(function (type) {
            return getFreeImagesNew(catergory).then(function (images) {
                console.log('#######images are ', images)
                array.push(images);
                return array;
            });
        })


        return Promise.all(promises).then(function (results) {
            console.log('### promise result #####', results)
            return results
        })


        // }, 500);
        // });
    }

    fetchUpdatedImages = (catergory) => {
        return new Promise(function (resolve, reject) {
            // some async operation here
            setTimeout(function () {
                // resolve the promise with some value
                getFreeImagesNew(catergory).then(function (images) {
                    resolve(images)

                });


            }, 500);
        });
    }

    navigateToShowAll = (cardType) => {
        this.props.navigation.navigate('CardsGallery', {
            cardType: cardType,
        });
    }

    // 点击立即下载只是跳转到商店,本地不做处理,如果没有更新,下次进入依然提醒
    // 点击稍后下载,本地记录时间,10天后再次提醒
    showAlert = () => {
        Alert.alert(
            'Update to the latest version',
            'Cardmaker App?',
            [
                {text: 'OK', onPress: () => Linking.openURL(downloadUrl)}, // open store if update is needed.
                {text: 'Download next time', onPress: () => console.log('update later')}
            ])
    }

    componentWillMount() {
        const {imageCategory} = this.state

        var self = this;
        VersionCheck.needUpdate()
            .then(async res => {
                if (res.isNeeded) {
                    this.showAlert();
                }
            });

        // Promise.all([this.fetchImages(imageCategory, cardsType.holiday), this.fetchImages(imageCategory, cardsType.birthday), this.fetchImages(imageCategory, cardsType.thankyou)])
        //     .then(function (results) {
        //         console.log('results are ', results)
        //         let latestChristmasCardsImages = results[0][0];
        //         let latestnewYearCardsImages = results[1][0];
        //         let latesteasterCardsImages = results[2][0];
        //         // let latestotherImages = results[3][0];
        //         console.log('latesteasterCardsImages are ',latesteasterCardsImages)
        //         /*
        //          let latestbirthDayImages = results[0][0];
        //          let latestholidayImages = results[1][0];
        //          let latestweddingImages = results[2][0];
        //          let latestotherImages = results[3][0];
        //          let latestImages = [];
        //          latestImages.push(latestbirthDayImages, latestholidayImages, latestweddingImages, latestotherImages);
        //
        //          self.setState(
        //          {
        //          birthdayImages: results[0],
        //          holidayImages: results[1],
        //          weddingImages: results[2],
        //          otherImages: results[3],
        //          latestImages: latestImages
        //
        //          });
        //
        //          */
        //         // do something with result1 and result2
        //         // available as results[0] and results[1] respectively
        //     })
        //     .catch(function (err) { /* ... */
        //     });

        this.fetchUpdatedImages(imageCategory).then(function (results) {
            console.log('results', results)
            self.setState({updatedcards: results});
        })


        this.setState({
            contentIsLoading: true
        });

        setTimeout(() => {
            this.setState({contentIsLoading: false});
        }, 4000);
    }

    componentDidMount() {
        this.resetAnimation();

    }

    componentWillUnmount() {
        this.setState({
            updatedcards: []
        })


    }

    resetAnimation() {
        this.setState({
            appReady: false,
            rootKey: Math.random()
        });

        setTimeout(() => {
            this.setState({
                appReady: true,
            });
        }, 1000);
    }

    onUnlock = data => {
        var unlock = data.unLock;
        if (unlock === true) {
            upDateRole();
        }
    };

    onUnLock = () => {
        this.props.navigation.navigate("UnLock", {onUnlock: this.onUnlock});

    }

    updateIndex = (selectedIndex) => {
        let showCategory = ['Cards', 'Invitations'];

        this.setState({selectedIndex: selectedIndex}, function () {
            for (let type of showCategory) {
                let index = showCategory.indexOf(type);

                if (this.state.selectedIndex === index) {

                    let imageType = (type == 'Cards') ? cardsType : invitationsType;
                    console.log('category is :', type, 'image type is', imageType)
                    this.setState({imageType: imageType, imageCategory: type});
                }
            }
        })

    }

    renderItem = ({item, index}) => {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0}/>;
    }

    renderCarousel = (data, title, subtitle, isLoaded) => {
        const heightStyle = {height: 150};

        return (
            <View style={[carouselStyle.carouselContainer, !isLoaded && heightStyle]}>
                <Placeholder.MultiWords onReady={isLoaded} words={words} animate="fade">
                    <Carousel
                        data={data}
                        renderItem={this.renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        inactiveSlideScale={0.95}
                        inactiveSlideOpacity={1}
                        enableMomentum={true}
                        activeSlideAlignment={'start'}
                        containerCustomStyle={carouselStyle.slider}
                        contentContainerCustomStyle={carouselStyle.sliderContentContainer}
                        activeAnimationType={'spring'}
                        activeAnimationOptions={{
                            friction: 4,
                            tension: 40
                        }}
                    />
                </Placeholder.MultiWords>
            </View>
        );
    }

    renderBanner = (data) => {
        return (
            <View style={{flexDirection: 'row', alignItems: 'flex-end', marginTop: 10,}}>

                {data.map((image, index) => (
                    <View
                        key={index}
                        style={{
                            flex: 1, marginHorizontal: 5,
                            justifyContent: 'center',
                        }}>
                        <Avatar
                            large
                            rounded
                            source={{uri: image.illustration}}
                            activeOpacity={0.7}
                        />

                    </View>))}
            </View>
        );
    }

    renderImageList = (category) => {
        console.log('category is ', category, this.state.updatedcards)
        return (
            <View>
                <View style={[layoutStyle.container]}>

                    <View style={carouselStyle.container}>
                        <Text style={carouselStyle.title}>{category}</Text>
                        <TouchableOpacity
                            onPress={() => this.navigateToShowAll(category)}>
                            <View style={carouselStyle.subtitleContainer}>
                                <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                                <Icon
                                    name='chevron-right'
                                    color={colors.secondary2}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {this.renderCarousel(this.state.updatedcards, category, 'Browse All', (!this.state.contentIsLoading))}

                </View>

            </View>
        )
    }

    componentWillReceiveProps(nextProps) {
        var isConnected = nextProps.screenProps.isConnected;//update netinfo
        if (this.props.screenProps.isConnected == false && isConnected == true) {
            this.resetAnimation();
        }

    }


    render() {
        var isConnected = this.props.screenProps.isConnected;

        if (!isConnected) {
            return Utils.renderOffline();
        }
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });


        const imageOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -50],
            extrapolate: 'clamp',
        });

        const bannerOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp',
        });
        const buttons = [{element: component1}, {element: component2}]
        const {selectedIndex, imageCategory} = this.state
        return (
            <View style={[layoutStyle.container, layoutStyle.maskLoader]} key={this.state.rootKey}>
                <Loader
                    isLoaded={this.state.appReady}
                    imageSource={this.maskImage}
                    backgroundStyle={layoutStyle.loadingBackgroundStyle}
                >
                    <ScrollView
                        style={carouselStyle.scrollView}

                        directionalLockEnabled={true}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                        )}
                    >

                        <View style={exploreStyle.scrollViewContent}>
                            <ButtonGroup
                                onPress={this.updateIndex}
                                selectedIndex={selectedIndex}
                                buttons={buttons}
                                containerStyle={{height: 40}}/>
                            <View>
                                {this.renderImageList(imageCategory)}
                            </View>
                        </View>

                    </ScrollView>


                    <Animated.View style={[exploreStyle.header, {height: headerHeight}]}>
                        <Animated.View
                            style={[
                                exploreStyle.backgroundImage,
                                {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},
                            ]}
                        >
                            <Text style={{
                                color: colors.white,
                                fontSize: 18,
                                paddingHorizontal: 10
                            }}>New</Text>
                            {this.renderBanner(this.state.latestImages)}

                        </Animated.View>
                        <Animated.View>
                            <View style={exploreStyle.bar}>
                                <Animated.View style={[exploreStyle.showBanner, {opacity: bannerOpacity,}]}>
                                    <Text style={[exploreStyle.title]}>
                                        It's Ok to want them all!</Text>
                                    <Icon
                                        raised
                                        name='key'
                                        type='font-awesome'
                                        color={colors.primary3}
                                        size={22}
                                        onPress={this.onUnLock}/>
                                </Animated.View>


                            </View>

                        </Animated.View>
                    </Animated.View>

                </Loader>
            </View>
        );
    }
}
