// Keep every input's accumulated camera position, but commit only the latest
// position in a display frame. The painting and its pins share this commit.
export function createFrameQueue<T>(write:(value:T)=>void,schedule:(callback:()=>void)=>number,cancel:(id:number)=>void) {
  let frame:number|null=null;
  let pending:T|undefined;
  return {
    push(value:T){
      pending=value;
      if(frame!==null)return;
      frame=schedule(()=>{
        frame=null;
        const next=pending;
        pending=undefined;
        if(next!==undefined)write(next);
      });
    },
    cancel(){if(frame!==null)cancel(frame);frame=null;pending=undefined;},
  };
}

// A small dead band prevents trackpad jitter from repeatedly changing labels.
export function zoomDetail(scale:number,visible:boolean,threshold:number){
  return scale>threshold+.025?true:scale<threshold-.025?false:visible;
}

export function wheelPixels(delta:number,mode:number,pageHeight:number){
  return delta*(mode===1?16:mode===2?pageHeight:1);
}
