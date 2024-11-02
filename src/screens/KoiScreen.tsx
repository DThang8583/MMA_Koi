import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getKoiList, Koi, RootStackParamList } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type KoiScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MainTabs"
>;

const KoiScreen: React.FC = () => {
  const [koiList, setKoiList] = useState<Koi[]>([]);
  const [filteredKoiList, setFilteredKoiList] = useState<Koi[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [origins, setOrigins] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

  const navigation = useNavigation<KoiScreenNavigationProp>();

  useEffect(() => {
    const fetchKoiList = async () => {
      try {
        const data = await getKoiList();
        setKoiList(data);
        setFilteredKoiList(data);

        const uniqueTypes = Array.from(
          new Set(data.map((koi) => koi.type.name))
        );
        setTypes(uniqueTypes);

        const uniqueOrigins = Array.from(
          new Set(data.map((koi) => koi.origin))
        );
        setOrigins(uniqueOrigins);

        const uniqueCategories = Array.from(
          new Set(data.map((koi) => koi.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching koi list:", error);
      }
    };

    fetchKoiList();
  }, []);

  const applyFilters = () => {
    let filtered = koiList;

    if (selectedCategory) {
      filtered = filtered.filter((koi) => koi.category === selectedCategory);
    }
    if (selectedType) {
      filtered = filtered.filter((koi) => koi.type.name === selectedType);
    }
    if (selectedOrigin) {
      filtered = filtered.filter((koi) => koi.type.origin === selectedOrigin);
    }
    if (selectedGender) {
      filtered = filtered.filter((koi) => koi.gender === selectedGender);
    }

    setFilteredKoiList(filtered);
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedType("");
    setSelectedOrigin("");
    setSelectedGender("");
    setFilteredKoiList(koiList);
  };

  const renderKoiCard = ({ item }: { item: Koi }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("KoiDetail", { id: item._id })}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text>Giống: {item.type?.name || "Unknown"}</Text>
          <Text>Danh mục: {item.category}</Text>
          <Text>
            Tuổi: {item.age} - Kích thước: {item.size}
          </Text>
          <Text>Giới tính: {item.gender}</Text>
          <Text style={styles.price}>{item.price}đ</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Lọc theo</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Bộ lọc</Text>

            <Picker
              selectedValue={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn Danh mục" value="" />
              {categories.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedType}
              onValueChange={(value) => setSelectedType(value)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn Giống" value="" />
              {types.map((type, index) => (
                <Picker.Item key={index} label={type} value={type} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedOrigin}
              onValueChange={(value) => setSelectedOrigin(value)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn Nguồn gốc" value="" />
              {origins.map((origin, index) => (
                <Picker.Item key={index} label={origin} value={origin} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedGender}
              onValueChange={(value) => setSelectedGender(value)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn Giới tính" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>

            <View style={{ marginVertical: "2%" }}>
              <Button title="Áp dụng" onPress={applyFilters} />
            </View>

            <View style={{ marginVertical: "2%" }}>
              <Button title="Xóa Lọc" onPress={resetFilters} color="orange" />
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={filteredKoiList}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderKoiCard}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F8F8FF",
  },
  filterButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    width: "35%",
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "center",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: "red",
    marginTop: 4,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});

export default KoiScreen;
