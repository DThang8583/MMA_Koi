import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import KoiCard from './KoiCard';
import { getKoiList } from '../../services/api';
import { Koi } from '../../types';

const KoiList: React.FC = () => {
    const [koiList, setKoiList] = useState<Koi[]>([]);

    useEffect(() => {
        const fetchKoiList = async () => {
            try {
                const data = await getKoiList();
                setKoiList(data);
            } catch (error) {
                console.error('Error fetching koi list:', error);
            }
        };

        fetchKoiList();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={koiList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <KoiCard koi={item} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F8F8FF',
    },
});

export default KoiList;
