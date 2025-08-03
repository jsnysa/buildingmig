import { useApi, useApiMutation } from './useApi'
import { roomAPI, type Room } from '../lib/api'
import { type RoomFormData } from '../lib/validations'

// Hook for fetching rooms list
export function useRooms(page = 1, limit = 10, available?: boolean) {
  return useApi(
    () => roomAPI.getRooms(page, limit, available),
    [page, limit, available]
  )
}

// Hook for fetching single room
export function useRoom(id: number) {
  return useApi(
    () => roomAPI.getRoom(id),
    [id]
  )
}

// Hook for creating room
export function useCreateRoom() {
  return useApiMutation<{ success: boolean; data: Room }, RoomFormData>(
    (data: RoomFormData) => roomAPI.createRoom(data)
  )
}

// Hook for updating room
export function useUpdateRoom() {
  return useApiMutation<{ success: boolean; data: Room }, { id: number; data: RoomFormData }>(
    ({ id, data }) => roomAPI.updateRoom(id, data)
  )
}

// Hook for deleting room
export function useDeleteRoom() {
  return useApiMutation<{ success: boolean }, number>(
    (id: number) => roomAPI.deleteRoom(id)
  )
}