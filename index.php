<?php

    $book_isbn = filter_input(INPUT_POST, "isbn");

    $parent = filter_input(INPUT_POST, "parent");

    $fp = fopen("book.json", "r+");
    $json = (array)json_decode(fread($fp, filesize("book.json")), true);
    fclose($fp);

    if ($book_isbn) {
        $book_isbn = preg_replace("/[^\d]/", "", $book_isbn);
        var_dump($book_isbn);
        $xml = new SimpleXMLElement(
            file_get_contents("http://iss.ndl.go.jp/api/sru?operation=searchRetrieve&query=isbn=$book_isbn")
        );

        var_dump($xml);
    }

?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>読んだ本を記録します</title>
</head>
<body>
<form method="post" action="">
    <p>
        <label>
            ISBN: <input type="text" name="isbn">
        </label>
    </p>
    <p>
        <input type="submit">
    </p>
</form>

<table>
    <tr>
        <th>ID</th>
        <th>タイトル</th>
        <th>ISBN</th>
    </tr>
    <?php foreach ($json as $datum): ?>
        <tr>
            <td><?= $datum["id"] ?></td>
            <td><?= $datum["title"] ?></td>
            <td><?= $datum["isbn"] ?></td>
        </tr>
    <?php endforeach; ?>
</table>
</body>
</html>
