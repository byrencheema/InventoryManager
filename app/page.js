'use client';
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, setDoc, getDocs, query, getDoc, doc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });

    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, "inventory", item.name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const itemNameToAdd = item ? item.name : itemName;

    if (!itemNameToAdd) return;

    const docRef = doc(firestore, "inventory", itemNameToAdd);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();

    if (!item) {
      setItemName("");
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top='50%' left='50%' bgcolor="white" p={2} borderRadius={2} width={400} border="2px solid #000" display="flex" flexDirection={"column"} gap={3} sx={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => { setItemName(e.target.value) }} ></TextField>
            <Button variant="outlined" onClick={() => {
              addItem();
              handleClose();
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>Add Item</Button>
      <TextField 
        variant="outlined" 
        placeholder="Search inventory..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2, width: '800px' }}
      />
      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#9fa2c0" display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Typography variant="h2" color="#333">Inventory</Typography>
        </Box>
      </Box>
      <Stack width={"800px"} height="300px" direction={"column"} spacing={2} overflow={"auto"}>
        {
          filteredInventory.map((item) => (
            <Box key={item.name} width="100%" height="50px" bgcolor="#f3f4f6" display="flex" alignItems="center" justifyContent="space-between" p={2}>
              <Box display="flex" flexGrow={1} alignItems="center">
                <Typography variant="h5" sx={{ flex: 1 }}>{item.name}</Typography>
              </Box>
              <Typography variant="h5" sx={{ width: '100px', textAlign: 'left' }}>{item.quantity}</Typography>
              <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={() => { removeItem(item) }}>Remove</Button>
                <Button variant="outlined" onClick={() => { addItem(item) }}>Add</Button>
              </Box>
            </Box>
          ))
        }
      </Stack>
    </Box>
  );
}
