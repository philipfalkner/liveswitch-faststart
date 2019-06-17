import Connection, { TransportType, StreamType, Direction } from './connection'

class ConnectionManager {
  constructor() {
    this.connections = []
  }

  async createConnection (connectionSettings) {
    let newConnection

    try {
      newConnection = new Connection(connectionSettings)
      await newConnection.connect()

      this.connections = [...this.connections, newConnection]
    } catch (ex) {
      console.error('Failed to create connection', ex)
      newConnection && newConnection.disconnect()
    }
  }

  getConnection (id) {
    return this.connections.find(connection => connection.getId() === id)
  }

  findConnections ({ transportType, streamType, direction }) {
    return this.connections.filter(connection => {
      if (transportType && connection.transportType !== transportType) {
        return false
      }

      if (streamType && !(connection.streamType | streamType)) {
        return false
      }

      if (direction && !(connection.direction | direction)) {
        return false
      }

      return true
    })
  }

  async closeAllConnections () {
    this.connections.forEach(async connection => await connection.disconnect())
    this.connections = []
  }
}

export default ConnectionManager
