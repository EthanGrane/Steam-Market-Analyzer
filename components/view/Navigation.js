import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { HomeIcon, SearchIcon, UserIcon } from './Icons';
import { useState } from 'react';

import LoginModal from './modals/LoginModal';
import { useAuth } from '../../context/authContext';
import icon from '../../assets/images/icon.png'



export default function Navigation() {

    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const { user, profile } = useAuth();

    return (
        <>
            <View style={styles.navigation}>
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 30, gap: 0, alignContent: 'space-between', justifyContent: "space-between" }}>

                    {/* HOME BUTTON */}
                    <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={icon} style={{ width: 24, height: 24, margin:16 }} />
                    </View>

                    {/* APP NAME */}
                    <Text style={styles.navigationText}>@SteamMarketAnalyzer</Text>

                    {/* USER BUTTON MODAL */}
                    <Pressable onPress={() => setLoginModalVisible(true)}>

                        <View style={{ width: 32, height: 32, borderRadius: 24, backgroundColor: '#151922', borderWidth: 1, borderColor: '#222838', alignItems: 'center', justifyContent: 'center' }}>

                            {
                                user && profile ? (
                                    <Image
                                        style={{ width: 24, height: 24, objectFit: 'contain' }}
                                        source={{ uri: profile.avatar }}
                                    />

                                ) :
                                    (
                                        <UserIcon size={24} />
                                    )
                            }
                        </View>

                    </Pressable>

                </View >
            </View >

            <LoginModal visible={loginModalVisible} setVisible={setLoginModalVisible} />
        </>
    );
}

const styles = StyleSheet.create({
    navigation: {
        padding: 20,
        backgroundColor: "#000",
    },
    navigationText: {
        margin: "auto",
        color: 'white',
        fontSize: 16,
        justifyContent: "center",
    }
});