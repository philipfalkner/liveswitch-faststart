export default function getCookie (name) {
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      if (ca[i].indexOf(name) !== -1) {
        var c = ca[i].trim()
        return c.substring((name.length + 1), ca[i].length).trim()
      }
    }
  }
  