<?php
namespace Org\Util;
class JsonSql {
  
  public $blocks;
  public $conditions;
  public $logicalOperators;
  public $type;
  public $prefix;
  public $defaultLogicalOperator = 'and';
  
  protected $json;
  protected $keywords = array('and', 'or', 'in', 'like', 'not in', 'not like', 'between', '<>', '>', '<', '>=', '<=', '=');
  private $keywordIsUpperCase = true;
  /**
     * 架构函数
     * 生成JsonSql对象
     * @access public
     * @param mixed $json Json查询数组或Json字符串
     */
  public function __construct($json, $scale = 'full', $prefix = '_') {
    if(is_string($json)) {
      $json = json_decode($json, true);
    }
    if(!is_array($json)) {
      return NULL;
    }
    switch ($scale) {
      case 'full':
        $this->json = $json;
        break;
      case 'condition':
        $this->json = array('condition'=>$json);
        break;
    }
    $this->prefix = $prefix;
  }
  
  public function parse() {
    return $this->condition();
  }
  
  protected function condition() {
    return $this->removeTopBrackets($this->walk_condition($this->json['condition']));    
  }
  
  private function isNormalArray($arr) {
    return count(array_filter(array_keys($arr), "is_numeric")) == count($arr);
  }
  
  private function parseValue($val, $needEqual = false) {
    if(is_string($val)) {
      if($val == "is null" || $val == "is not null") {
        return " " . ($this->keywordIsUpperCase ? strtoupper($val) : $val);
      } else if($val[0] != "'" || $val[strlen($val) - 1] !="'") {
        return ($needEqual ? " = " : "")."'$val'";
      }
    }
    return ($needEqual ? " = " : "").$val;
  }
  
  private function logicRet($ope, $val, $field) {
    if(!$this->isNormalArray($val)) {
      return $this->walk_condition($val, $field, $ope);
    }
    $isBracketsNeeded = count($val) > 1;
    if($this->keywordIsUpperCase) $ope = strtoupper ($ope);
    $result = implode(" $ope ", $val);
    if ($result && $isBracketsNeeded) $result = '(' . $result . ')';
    return result;
  }
  
  private function compareRet($field, $ope, $val) {
    return $field . " $ope " . $this->parseValue($val);
  }
  
  private function containRet($field, $ope, $list) {
    if(count($list) == 1) {
      $val = is_array($list) ? $list[0] : $list;
      return $field . ($ope == 'in' ? ' = ' : ' <> ') . $this->parseValue($val);
    }
    if($this->keywordIsUpperCase) $ope = strtoupper ($ope);
    for($i = 0; $i < count($list); $i++) {
      $list[$i] = $this->parseValue($list[$i]);
    }
    return $field . " $ope (" . implode(', ', $list) . ')';
  }
  
  private function betweenRet($field, $list) {
    if(count($list) != 2) {
      return '';
    } else {
      $between = $this->keywordIsUpperCase ? "BETWEEN" : "between";
      $and = $this->keywordIsUpperCase ? "AND" : "and";
      return $field . " $between " . $this->parseValue($list[0]) . " $and " . $this->parseValue($list[1]);
    }
  }
  
  private function likeRet($field, $ope, $list) {
    if($this->keywordIsUpperCase) $ope = strtoupper ($ope);
    if(count($list) == 1) {
      $val = is_array($list) ? $list[0] : $list;
      return $field . " $ope " . $this->parseValue($val);
    } else {
      $ret = array();
      if(count($list) > 1 && $list[0][0] == $this->prefix) {
        $logic = substr($list[0], 1);
        array_shift($list);
      } else {
        $logic = $this->defaultLogicalOperator;
      }
      foreach ($list as $val) {
        $ret[] = $field . " $ope " . $this->parseValue($val);
      }
      $logic = $this->keywordIsUpperCase ? strtoupper($logic) : $logic;
      return "(" . implode(" $logic ", $ret) . ")";
    }
  }
  
  private function walk_condition($condition, $field="", $logicOperator = '') {
    if($logicOperator === '') ($logicOperator = $this->defaultLogicalOperator);
    $res = array();
    foreach($condition as $key => $child) {
      if(in_array($key, $this->keywords)) {
        switch ($key) {
          case 'and': case 'or':
            $res[] = $this->logicRet($key, $child, $field);
            break;
          case '>': case '<': case '<>': case '<=': case '>=':
            $res[] = $this->compareRet($field, $key, $child);
            break;
          case 'in': case 'not in':
            $res[] = $this->containRet($field, $key, $child);
            break;
          case 'like': case 'not like':
            $res[] = $this->likeRet($field, $key, $child);
            break;
          case 'between':
            $res[] = $this->betweenRet($field, $child);
            break;
        }
      } else { 
        if($this->isNormalArray($child)){
          $res[] = $this->containRet($key, 'in', $child);
        } else if(is_array($child)) {
          $res[] = $this->walk_condition($child, $key, $logicOperator);
        } else {
          $res[] = $key . $this->parseValue($child, TRUE);
        }
      }
    }
    $isBracketsNeeded = count($res) > 1;
    if($this->keywordIsUpperCase) $logicOperator = strtoupper ($logicOperator);
    $res = implode(" $logicOperator ", $res);
    if($res && $isBracketsNeeded) $res = "(" . $res . ")";
    return $res;
  }
  
  private function removeTopBrackets($condition) {
    if (strlen($condition) > 0 && $condition[0] == '(' && $condition[strlen($condition) - 1] == ')') {
      $condition = substr($condition, 1, -1);
    }
    return $condition;
  }
}

