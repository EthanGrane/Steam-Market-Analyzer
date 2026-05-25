import { View, TextInput, Pressable, Text } from 'react-native';
import { globalStyles } from '../../assets/styles/Styles';
import { SearchIcon } from './Icons';
import { StyleSheet } from 'react-native';
import { colors } from '../../assets/ui/tokens';

export default function SearchBar({ value, onChangeText }) {
    return (
        <View style={globalStyles.row}>

            <TextInput
                style={globalStyles.input}
                placeholderTextColor="#8b93a7"
                placeholder="Search..."
                value={value}
                onChangeText={onChangeText}
                onEndEditing={(e) => onChangeText(e.nativeEvent.text)}
            />

            <Pressable onPress={()=>onChangeText("")} style={{ justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                <>
                    {
                        value ? (<Text style={s.icon}>✕</Text>) : (<SearchIcon size={24} />) 
                    }
                </>
            </Pressable>

        </View>
    );
}

const s = StyleSheet.create({
    icon:
    {
        color: 'white'
    }
})