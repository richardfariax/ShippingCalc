import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { addFreight } from "../model/freight";
import styles from "../style/CreateFreight";

export default function CreateFreight() {
  const navigation = useNavigation();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [value, setValue] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [openedDate, setOpenedDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);

  useEffect(() => {
    const currentDate = moment().format("DD/MM/YYYY");
    setOpenedDate(currentDate);

    const getUsername = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        setCreatedBy(username);
      } catch (error) {
        console.error("Erro ao obter o nome de usuário:", error);
      }
    };

    getUsername();
  }, []);

  const handleSaveFreight = async () => {
    if (!origin || !destination || !value.trim() || !cargoType.trim()) {
      showAlert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      await addFreight(
        origin,
        destination,
        value,
        cargoType,
        openedDate,
        createdBy
      );
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar o frete:", error);
    }
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    if (currentSelection === "origin") {
      setOrigin({ latitude, longitude });
    } else if (currentSelection === "destination") {
      setDestination({ latitude, longitude });
    }
    setIsMapModalVisible(false);
  };

  const openMapModal = (selection) => {
    setCurrentSelection(selection);
    setIsMapModalVisible(true);
  };

  const formatCurrencyOnInput = (value) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) return "";

    const floatValue = parseFloat(numericValue) / 100;

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(floatValue);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Origem:</Text>
      <TouchableOpacity onPress={() => openMapModal("origin")}>
        <MapView
          style={styles.map}
          region={
            origin
              ? {
                  latitude: origin.latitude,
                  longitude: origin.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }
              : {
                  latitude: -23.55052,
                  longitude: -46.633308,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
          }
        >
          {origin && <Marker coordinate={origin} title="Origem" />}
        </MapView>
      </TouchableOpacity>
      <Text style={styles.title}>Destino:</Text>
      <TouchableOpacity onPress={() => openMapModal("destination")}>
        <MapView
          style={styles.map}
          region={
            destination
              ? {
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }
              : {
                  latitude: -23.55052,
                  longitude: -46.633308,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
          }
        >
          {destination && <Marker coordinate={destination} title="Destino" />}
        </MapView>
      </TouchableOpacity>
      <Text style={styles.title}>Valor do Frete:</Text>
      <TextInput
        style={styles.input}
        placeholder="R$ 0,00"
        value={value}
        keyboardType="numeric"
        onChangeText={(text) => setValue(formatCurrencyOnInput(text))}
      />
      <Text style={styles.title}>Tipo da Carga:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tipo da Carga"
        value={cargoType}
        onChangeText={(text) => setCargoType(text)}
      />

      <Text style={styles.title}>Data de Abertura:</Text>
      <TextInput
        style={styles.input}
        placeholder="Data de Abertura (DD/MM/AAAA)"
        value={openedDate}
        editable={false}
      />

      <Text style={styles.title}>Aberto por:</Text>
      <TextInput
        style={styles.input}
        placeholder="Aberto por"
        value={createdBy}
        editable={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveFreight}>
        <Text style={styles.buttonText}>Salvar Frete</Text>
      </TouchableOpacity>

      <Modal visible={isMapModalVisible} animationType="slide">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude:
              currentSelection === "origin"
                ? origin?.latitude || -23.55052
                : destination?.latitude || -23.55052,
            longitude:
              currentSelection === "origin"
                ? origin?.longitude || -46.633308
                : destination?.longitude || -46.633308,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          onPress={handleMapPress}
        >
          {currentSelection === "origin" && origin && (
            <Marker coordinate={origin} title="Origem" />
          )}
          {currentSelection === "destination" && destination && (
            <Marker coordinate={destination} title="Destino" />
          )}
        </MapView>

        <TouchableOpacity
          style={[styles.button, { margin: 10 }]}
          onPress={() => setIsMapModalVisible(false)}
        >
          <Text style={styles.buttonText}>Fechar Mapa</Text>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}
