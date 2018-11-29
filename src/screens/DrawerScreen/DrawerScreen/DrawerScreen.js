import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, StyleSheet, ImageBackground, Image, FlatList } from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Thumbnail } from 'native-base';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';


//TODO: Custome Pages
import { colors, images } from "../../../constants/Constants";

//TODO: Json Files
import menuData from "../../../assets/jsonfiles/drawerScreen/leftMenuList.json";


class DrawerScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            menuBarList: []
        }
    }

    //TODO: Page Life Cycle
    componentWillMount() {
        this.getLeftMenuList();
    }


    getLeftMenuList() {
        this.setState({
            menuBarList: menuData.menus
        });
    }

    //TODO:  function NavigateToScreen
    navigateToScreen = (route) => () => {
        console.log('page name' + route);
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
        this.props.navigation.dispatch(DrawerActions.closeDrawer())
    }

    render() {
        return (
            <Container>
                <ImageBackground
                    source={images.loginScreen.backgoundImage}
                    style={styles.container}
                >
                    <View style={styles.viewHeading}>
                        <Image style={styles.userProfileIcon} source={require('../../../assets/images/developer/anantTapadia.png')} />
                        <Text style={styles.txtUserName}>Anant Tapadia</Text>
                    </View>

                    <ScrollView>
                        <View>
                            <FlatList
                                data={this.state.menuBarList}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) =>
                                    <View style={styles.menuItem}>
                                        <Icon name={item.icon} size={30} color="#ffffff" />
                                        <Text style={styles.txtMenuItem} onPress={this.navigateToScreen(item.pageName)}>
                                            {item.title}
                                        </Text>
                                    </View>
                                }
                                keyExtractor={item => item.id}
                            />
                        </View>
                    </ScrollView>
                </ImageBackground>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
    },
    userProfileIcon: {
        width: 140,
        height: 140,
        borderRadius: 70
    },
    viewHeading: {
        marginTop: 10,
        alignItems: 'center',
    },
    txtUserName: {
        color: "#ffffff",
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 10,
        marginBottom: 10,
    },
    menuItem: {
        padding: 10,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        alignItems: 'center'
    },
    txtMenuItem: {
        paddingLeft: 10,
        color: '#ffffff',
        fontSize: 20
    }
});


DrawerScreen.propTypes = {
    navigation: PropTypes.object
};

export default DrawerScreen;