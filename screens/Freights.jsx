import React, { useState, useEffect } from "react";
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
            Alert.alert("Erro", "Nenhuma tarefa encontrada.");
            return;
          }

          setTasks(tasksFromDB);
        } catch (error) {
          console.error("Erro ao carregar as tarefas:", error);
          Alert.alert("Erro", "Não foi possível carregar as tarefas.");
        }
      };

      setupFreightsTable();
      loadTasks();
      return () => {};
    }, [])
  );

  const handleCreateTask = () => {
    try {
      navigation.navigate("CreateTask");
    } catch (error) {
      console.error("Erro ao navegar para criar tarefa:", error);
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
            task: item,
          })
        }
      >
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskText}>Aberto em: {item.openedDate}</Text>
        <Text style={styles.taskText}>
          Origem: {item.origin?.latitude}, {item.origin?.longitude}
        </Text>
        <Text style={styles.taskText}>
          Destino: {item.destination?.latitude}, {item.destination?.longitude}
        </Text>
        <Text style={styles.taskText}>
          Valor: {item.value ? `R$ ${item.value}` : "N/A"}
        </Text>
        <Text style={styles.taskText}>
          Tipo de carga: {item.cargoType || "N/A"}
        </Text>
      </TouchableOpacity>
    );
  };

  const sortedTasks = showCompleted
    ? tasks.filter((task) => task.status === "Concluído")
    : tasks.filter((task) => task.status !== "Concluído");

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.taskList}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
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