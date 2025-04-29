// Função para formatar valores em BRL
function formatToBRL(value) {
  return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  });
}

// Função para converter USD para BRL
function convertUSDtoBRL(usdValue, exchangeRate) {
  // Remove caracteres não numéricos e converte para número
  const numericValue = parseFloat(usdValue.replace(/[^\d.-]/g, ''));
  if (isNaN(numericValue)) return null;
  
  // Calcula o valor em BRL
  const brlValue = numericValue * exchangeRate;
  return brlValue;
}

// Função para atualizar os elementos na página
function updatePrices(exchangeRate) {
  // Seleciona todos os elementos com valores em USD
  const currencyElements = document.querySelectorAll('.currency');
  const amountElements = document.querySelectorAll('.amount');
  const savingsElements = document.querySelectorAll('.savings');
  const originalPriceElements = document.querySelectorAll('.original-price');
  const discountedPriceElements = document.querySelectorAll('.discounted-price');
  
  // Atualiza o símbolo da moeda
  currencyElements.forEach(element => {
      element.textContent = 'R$';
  });
  
  // Atualiza os valores principais
  amountElements.forEach(element => {
      const usdValue = element.textContent;
      const brlValue = convertUSDtoBRL(usdValue, exchangeRate);
      if (brlValue !== null) {
          element.textContent = Math.round(brlValue); // Arredonda para inteiro para manter o design
      }
  });
  
  // Atualiza as mensagens de economia
  savingsElements.forEach(element => {
      const usdText = element.textContent;
      const usdValue = usdText.match(/\$(\d+)/);
      
      if (usdValue && usdValue[1]) {
          const brlValue = convertUSDtoBRL(usdValue[1], exchangeRate);
          if (brlValue !== null) {
              element.textContent = `✓ VOCÊ ECONOMIZA ${formatToBRL(brlValue)}!`;
          }
      }
  });
  
  // Atualiza os preços originais
  originalPriceElements.forEach(element => {
      const usdValue = element.textContent;
      const brlValue = convertUSDtoBRL(usdValue, exchangeRate);
      if (brlValue !== null) {
          element.textContent = formatToBRL(brlValue);
      }
  });
  
  // Atualiza os preços com desconto
  discountedPriceElements.forEach(element => {
      const usdValue = element.textContent;
      const brlValue = convertUSDtoBRL(usdValue, exchangeRate);
      if (brlValue !== null) {
          element.textContent = formatToBRL(brlValue);
      }
  });
  
  // Atualiza os textos "Per Bottle" para "Por Frasco"
  const perItemElements = document.querySelectorAll('.per-item');
  perItemElements.forEach(element => {
      element.innerHTML = 'Por<br>Frasco';
  });
  
  // Atualiza os textos "TOTAL:"
  const totalElements = document.querySelectorAll('.total');
  totalElements.forEach(element => {
      const textContent = element.innerHTML;
      const updatedContent = textContent.replace('TOTAL:', 'TOTAL:');
      element.innerHTML = updatedContent;
  });
  
  // Atualiza os banners de frete
  const shippingBanners = document.querySelectorAll('.shipping-banner');
  shippingBanners.forEach(element => {
      element.textContent = '🚚 FRETE GRÁTIS PARA O BRASIL';
  });
  
  // Traduz outros elementos da página
  translatePageElements();
}

// Função para traduzir elementos da página
function translatePageElements() {
  // Traduzir títulos e textos principais
  const translations = {
    // Cabeçalhos
    'The #1 Fat-Burning Secret Big Pharma Wants to Bury!': 'O Segredo #1 de Queima de Gordura que a Indústria Farmacêutica Quer Esconder!',
    'The SHOCKING Fat-Burning Formula That\'s Taking Over America!': 'A SURPREENDENTE Fórmula de Queima de Gordura que Está Conquistando o Brasil!',
    'Claim Your Discounted Lipo Burn Now While Supplies Last!': 'Garanta seu Lipo Burn com Desconto Enquanto Durar o Estoque!',
    
    // Cabeçalhos dos cartões de produto
    'Best Value!': 'Melhor Valor!',
    'Normal Value': 'Valor Normal',
    '180 Days, 6 Bottles': '180 Dias, 6 Frascos',
    
    // Recursos
    '180 DAYS GUARANTEE': '180 DIAS DE GARANTIA',
    '3 FREE E-BOOKS': '3 E-BOOKS GRÁTIS',
    'WORLDWIDE SHIPPING': 'ENVIO MUNDIAL',
    'BIGGEST DISCOUNT': 'GRANDE DESCONTO',
    // Botões
    '🛒 Buy Now': '🛒 Comprar Agora',
    
    // Seção de satisfação
    '100% Satisfaction': '100% de Satisfação',
    'Guarantee': 'Garantia',
    'Lipo Burn comes with a 180-day money-back guarantee from the day of purchase.': 'Lipo Burn vem com uma garantia de devolução do dinheiro de 180 dias a partir da data de compra.'
  };
  
  // Traduzir elementos específicos
  for (const [original, translated] of Object.entries(translations)) {
    // Busca em todos os elementos de texto comuns
    document.querySelectorAll('h1, h2, h3, h4, p, button, li').forEach(element => {
      if (element.textContent.trim() === original) {
        element.textContent = translated;
      }
    });
  }
  
  // Traduzir elementos específicos da seção de satisfação
  const satisfactionArticle = document.querySelector('.satisfaction_card > article');
  if (satisfactionArticle) {
    satisfactionArticle.innerHTML = 'Se você não estiver 100% satisfeito com nosso produto ou seus resultados dentro de 180 dias, você pode nos enviar uma mensagem ou um e-mail para nossa equipe que está disponível 24 horas por dia.<br><br>Nós alegremente reembolsaremos cada centavo do seu dinheiro, mesmo que os frascos já estejam vazios.';
  }
  
  // Traduzir botões de compra
  document.querySelectorAll('.buy-button').forEach(button => {
    button.textContent = '🛒 Comprar Agora';
  });
}

// Função principal que busca a taxa de câmbio e atualiza a página
function initCurrencyConverter() {
  // Busca a taxa de câmbio atual
  fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
      .then(response => response.json())
      .then(data => {
          // Obtém a taxa de câmbio
          const exchangeRate = parseFloat(data.USDBRL.bid);
          
          // Atualiza os preços na página
          updatePrices(exchangeRate);
      })
      .catch(error => {
          console.error('Erro ao obter cotação:', error);
          
          // Em caso de erro, usa uma taxa fixa e continua com a conversão
          const fixedRate = 5.5; // Taxa fixa de contingência
          updatePrices(fixedRate);
      });
}

// Inicia o conversor quando a página estiver carregada
document.addEventListener('DOMContentLoaded', initCurrencyConverter);