'use server'


export async function handleLargePayload(largeJson: number[]) {
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(JSON.stringify(largeJson));
    const payloadLength = bytes.length

    console.log('Action - body length: %d bytes', payloadLength);

    // Simulate some processing
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      message: `✓ Successfully processed ${payloadLength} bytes of data`
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

