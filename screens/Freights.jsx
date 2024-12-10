import React, { useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllFreights, setupFreightsTable } from "../model/freight";
import styles from "../style/Freights";

export default function Freights() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadTasks = async () => {
        try {
          const currentUser = await AsyncStorage.getItem("username");
          if (!currentUser) {
            Alert.alert(
              "Erro",
              "Usuário não encontrado no armazenamento local."
            );
            return;
          }

          const tasksFromDB = await getAllFreights(currentUser);

          if (!tasksFromDB) {
            Alert.alert("Erro", "Nenhum frete encontrada.");
            return;
          }

          setTasks(tasksFromDB);
        } catch (error) {
          console.error("Erro ao carregar os fretes:", error);
          Alert.alert("Erro", "Não foi possível carregar os fretes.");
        }
      };

      setupFreightsTable();
      loadTasks();
      return () => {};
    }, [])
  );

  const handleCreateFreight = () => {
    try {
      navigation.navigate("CreateFreight");
    } catch (error) {
      console.error("Erro ao navegar para criar frete:", error);
      Alert.alert("Erro", "Não foi possível navegar para a criação.");
    }
  };

  const toggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const renderTaskItem = ({ item }) => {
    const isTaskFiltered = showCompleted
      ? item.status === "Concluído"
      : item.status !== "Concluído";

    if (!isTaskFiltered) return null;

    return (
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() =>
          navigation.navigate("Freight", {
            freight: item,
          })
        }
      >
        <Text style={styles.taskTitle}>{item.cargoType}</Text>
        <Text style={styles.taskText}>Aberto em: {item.openedDate}</Text>
        <Text style={styles.taskText}>
          Origem: {item.origin ? JSON.parse(item.origin)?.latitude : "N/A"}
        </Text>
        <Text style={styles.taskText}>
          Destino:{" "}
          {item.destination ? JSON.parse(item.destination)?.latitude : "N/A"}
        </Text>
        <Text style={styles.taskText}>Valor: {item.value || "N/A"}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.taskList}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateFreight}>
        <Text style={styles.buttonText}>Novo Frete</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={toggleShowCompleted}
      >
        <Text style={styles.filterButtonText}>
          {showCompleted ? "Mostrar Abertos" : "Mostrar Concluídos"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
