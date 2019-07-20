var app = new Vue({
  el: '#app',
  data: {
    quote: '',
    quotes: [],
    loading: false
  },
  mounted: () => {
    document.getElementById('input-quote').focus();
  },
  methods: {
    addQuote: function () {

      if (this.quote.length == 0) {
        this.shakeInputBox();
        return;
      }

      const quote_input_element = document.getElementById('input-quote');
      const quote = this.quote;
      var self = this;

      // lets disable input filed until the process is completed
      // to avoid conflicts due to network delay
      quote_input_element.disabled = true;
      this.toggleSpin();

      axios.get('http://api.creativehandles.com/getRandomColor')
        .then(function (response) {
          self.setQuote(quote, response.data.color, null);
        })
        .catch(function (error) {
          self.setQuote(quote, '#6d4298', '#FFF');
        })
        .finally( function() {
          self.quote = '';
          quote_input_element.disabled = false;
          quote_input_element.focus();
          self.toggleSpin();
        })
    },

    setQuote: function(quote, bg_color, text_color) {

      if (text_color === null) {
        text_color = this.invertHex(bg_color);
      }

      this.quotes.unshift({
        quote: quote,
        style: {
          backgroundColor: bg_color,
          color: text_color
        }
      });

      document.title = quote;
    },

    shakeInputBox: function() {
      const input_element = document.getElementById('input-quote');
      input_element.classList.add("shake");

      setTimeout(() => {
        input_element.classList.remove("shake");
      }, 1000);
    },

    invertHex: function(hex) {
      hex = hex.substring(1); 
      hex = parseInt(hex, 16);
      hex = 0xFFFFFF ^ hex;
      hex = hex.toString(16);
      hex = ("000000" + hex).slice(-6);
      hex = "#" + hex;
      return hex;
    },

    toggleSpin: function() {
      this.loading = !this.loading;
    }
  }
});