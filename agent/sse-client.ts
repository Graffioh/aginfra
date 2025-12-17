import type { Response } from "express";

let inspectionClient: Response | null = null;
let contextClient: Response | null = null;

export function setInspectionClient(res: Response) {
    inspectionClient = res;
}

export function clearInspectionClient() {
    inspectionClient = null;
}

export function setContextClient(res: Response) {
    contextClient = res;
}

export function clearContextClient() {
    contextClient = null;
}

export function sendInspectionMessage(message: string) {
    console.log(message);
    if (inspectionClient) {
        const lines = message.split(/\r?\n/);
        for (const line of lines) {
            inspectionClient.write(`data: ${line}\n`);
        }
        inspectionClient.write(`\n`);
    }
}

export function sendContextUpdate(context: any[]) {
    if (contextClient) {
        contextClient.write(`data: ${JSON.stringify(context)}\n\n`);
    }
}