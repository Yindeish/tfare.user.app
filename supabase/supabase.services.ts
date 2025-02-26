import { supabase } from "./supabase.config";

const tableInsertEventListener = async ({channelName, eventName, fnToRun}:{ channelName: string,
    eventName: string,
    fnToRun: ({payload}:{payload: any}) => void}) => {
    supabase
    .channel(eventName)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rt_events' }, (payload) => {
      fnToRun({payload});
    })
    .subscribe();
  }
  
  // const emitTableUpdateEvent = async ({channelName, eventName, payload, fnToRun}:{ channelName: string,
  const tableUpdateEventListener = async ({channelName, eventName, payload, fnToRun}:{ channelName: string,
    eventName: string,
    payload: any, fnToRun: () => void}) => {
    supabase
    .channel(eventName)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rt_events' }, (payload) => {
      fnToRun();
    })
    .subscribe();
  }

  export const SupabaseServices = {
    tableInsertEventListener,
    tableUpdateEventListener,
  }