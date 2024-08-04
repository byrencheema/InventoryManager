'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, setDoc } from "firebase/firestore";
import { getDocs, query } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = []
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });

    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, "inventory", item.name);
    const docSnap = await getDocs(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    awaitupdateInventory();
  }

  const addItem = async () => {
    const docRef = doc(firestore, "inventory", itemName);
    const docSnap = await getDocs(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    }
    else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top='50%' left='50%' bgcolor="white" p={2} borderRadius={2} width={400} border="2px solid #00)000" p={4} display="flex" flexDirection={"column"} gap={3} sx={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => { setItemName(e.target.value) }} ></TextField>
            <Button variant="outlined" onClick={() => {
              addItem(itemName)
              setItemName("")
              handleClose()
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>Add Item</Button>
      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#9fa2c0" display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Typography variant="h2" color="#333">Inventory</Typography>
        </Box>
      </Box>
      <Stack width={"800px"} height="300px" direction={"column"} spacing={2} overflow={"auto"}>
        {
          inventory.map((item) => (
            <Box key={item.name} width="100%" height="50px" bgcolor="#f3f4f6" display="flex" alignItems="center" justifyContent="space-between" p={2}>
              <Typography variant="h5">{item.name}</Typography>
              <Typography variant="h5">{item.quantity}</Typography>
              <Button variant="outlined" onClick={() => { removeItem(item) }}>Remove</Button>
            </Box>
          ))
        }
      </Stack>
    </Box>
  )
}
