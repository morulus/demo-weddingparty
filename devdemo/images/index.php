<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Про подарки");
$APPLICATION->AddHeadScript('/lam/vendor/printpdf/printpdf.js');
?><article>
<p>
	 Дорогие и любимые наши гости, мы просим вас отнестись с пониманием к нашей просьбе: если вы хотите сделать нам подарок, мы с радостью примем его денежным переводом, потому что мы хотим выбрать подарок сами, позже. Это даст нам возможность продлить этот праздник еще на несколько дней, а выбранный впоследствии подарок будет напоминать наше свадебное торжество, когда все близкие и любимые нами люди были с нами, в одном месте, в один час!
</p>
<p>
	 Заранее благодарим вас, Ваши Юлия и Андрей
</p>
 </article> <article>
<h3>СЧЕТ ДЛЯ ПЕРЕВОДА</h3>
 </article> <article>
<h3>В рублях:</h3>
<p class="low">
	 АО «Райффайзенбанк» г Москва Получатель – Спиридонова Юлия Романовна&nbsp;
</p>
<p class="low">
	 Бик – 044525700&nbsp;
</p>
<p class="low">
	 Кор. счет – 30101810200000000700&nbsp;
</p>
<p class="low">
	 Счет получателя – 40817810001003192073
</p>
 </article> <article>
<h3>В евро:</h3>
<p class="low">
	 1. Реквизиты Банка-посредника (Intermediary bank) – Raiffeisen Bank International AG&nbsp;
</p>
<p class="low">
	 Имя получателя (Beneficiary name) – Spiridonova Yulia SWIFT – RZBAATWW&nbsp;
</p>
<p class="low">
	 Address – Am Standtpark 9, A-1030 Vienna, Austria&nbsp;
</p>
<p class="low">
	 Номер счета в Банке-посреднике (Correspondentaccount) – 001-55.025.928
</p>
 2. Реквизиты Банка-получателя (Beneficiarybank) – AORaiffeisenbank <br>
<p class="low">
	 SWIFT – RZBMRUMM Address – 17/1 Troitskaya, Moscow, 129090, Russia&nbsp;
</p>
<p class="low">
	 Номер счета получателя (Beneficiary account number) – 40817978801000715281
</p>
 </article> <article>
<h3>В долларах:</h3>
<p class="low">
	 1. Реквизиты Банка-посредника (Intermediary bank) – Standart Chartered Bank New York&nbsp;
</p>
<p class="low">
	 SWIFT – SCBLUS33&nbsp;
</p>
<p class="low">
	 CHIPS ABA – 0256&nbsp;
</p>
<p class="low">
	 FEDWIRENO – 026002561&nbsp;
</p>
<p class="low">
	 Номер счета в Банке посреднике (Correspondentaccount) – 3582021665001 <br>
</p>
<p class="low">
	 2. Реквизиты Банка-получателя – AO Raiffeisenbank <br>
</p>
<p class="low">
	 Address – 17/1Troitskaya, Moscow, 129090, Russia
</p>
<p class="low">
	 SWIFT – RZ BM RU MM&nbsp;
</p>
<p class="low">
	 Номер счета получателя (Beneficiary account number) – 4081 7840 0010 0099 2233
</p>
 </article> <article> <a href="/details.doc" download=""><button>Скачать</button></a> <a href="" onclick="printpdf('/details.pdf');return false;" desktop-required="true"><button>Распечатать</button></a> </article> <article mobile-required="true">
<form action="/ajax/form.php" data-controller="ajax">
	<fieldset>
 <input name="file" value="send2email" type="hidden"> <input name="subject" value="Свадьба Юлии и Андрея - Реквизиты счетов" type="hidden"> <span for="">E-mail: </span><input name="email" required="" type="email">
	</fieldset>
 <button>Отправить реквизиты на e-mail</button>
</form>
 </article><?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>